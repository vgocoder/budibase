const { doWithDB } = require("../db")
const { StaticDatabases } = require("../db/constants")
const { baseGlobalDBName } = require("./utils")
const {
  getTenantId,
  DEFAULT_TENANT_ID,
  isMultiTenant,
  getTenantIDFromAppID,
} = require("../context")
const env = require("../environment")

const TENANT_DOC = StaticDatabases.PLATFORM_INFO.docs.tenants
const PLATFORM_INFO_DB = StaticDatabases.PLATFORM_INFO.name

exports.addTenantToUrl = url => {
  const tenantId = getTenantId()

  if (isMultiTenant()) {
    const char = url.indexOf("?") === -1 ? "?" : "&"
    url += `${char}tenantId=${tenantId}`
  }

  return url
}

exports.doesTenantExist = async tenantId => {
  return doWithDB(PLATFORM_INFO_DB, async db => {
    let tenants
    try {
      tenants = await db.get(TENANT_DOC)
    } catch (err) {
      // if theres an error the doc doesn't exist, no tenants exist
      return false
    }
    return (
      tenants &&
      Array.isArray(tenants.tenantIds) &&
      tenants.tenantIds.indexOf(tenantId) !== -1
    )
  })
}

exports.tryAddTenant = async (tenantId, userId, email) => {
  return doWithDB(PLATFORM_INFO_DB, async db => {
    const getDoc = async id => {
      if (!id) {
        return null
      }
      try {
        return await db.get(id)
      } catch (err) {
        return { _id: id }
      }
    }
    let [tenants, userIdDoc, emailDoc] = await Promise.all([
      getDoc(TENANT_DOC),
      getDoc(userId),
      getDoc(email),
    ])
    if (!Array.isArray(tenants.tenantIds)) {
      tenants = {
        _id: TENANT_DOC,
        tenantIds: [],
      }
    }
    let promises = []
    if (userIdDoc) {
      userIdDoc.tenantId = tenantId
      promises.push(db.put(userIdDoc))
    }
    if (emailDoc) {
      emailDoc.tenantId = tenantId
      emailDoc.userId = userId
      promises.push(db.put(emailDoc))
    }
    if (tenants.tenantIds.indexOf(tenantId) === -1) {
      tenants.tenantIds.push(tenantId)
      promises.push(db.put(tenants))
    }
    await Promise.all(promises)
  })
}

exports.getGlobalDBName = (tenantId = null) => {
  // tenant ID can be set externally, for example user API where
  // new tenants are being created, this may be the case
  if (!tenantId) {
    tenantId = getTenantId()
  }
  return baseGlobalDBName(tenantId)
}

exports.doWithGlobalDB = (tenantId, cb) => {
  return doWithDB(exports.getGlobalDBName(tenantId), cb)
}

exports.lookupTenantId = async userId => {
  return doWithDB(StaticDatabases.PLATFORM_INFO.name, async db => {
    let tenantId = env.MULTI_TENANCY ? DEFAULT_TENANT_ID : null
    try {
      const doc = await db.get(userId)
      if (doc && doc.tenantId) {
        tenantId = doc.tenantId
      }
    } catch (err) {
      // just return the default
    }
    return tenantId
  })
}

// lookup, could be email or userId, either will return a doc
exports.getTenantUser = async identifier => {
  return doWithDB(PLATFORM_INFO_DB, async db => {
    try {
      return await db.get(identifier)
    } catch (err) {
      return null
    }
  })
}

exports.isUserInAppTenant = (appId, user = null) => {
  let userTenantId
  if (user) {
    userTenantId = user.tenantId || DEFAULT_TENANT_ID
  } else {
    userTenantId = getTenantId()
  }
  const tenantId = getTenantIDFromAppID(appId) || DEFAULT_TENANT_ID
  return tenantId === userTenantId
}

exports.getTenantIds = async () => {
  return doWithDB(PLATFORM_INFO_DB, async db => {
    let tenants
    try {
      tenants = await db.get(TENANT_DOC)
    } catch (err) {
      // if theres an error the doc doesn't exist, no tenants exist
      return []
    }
    return (tenants && tenants.tenantIds) || []
  })
}
