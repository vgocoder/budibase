import { context } from "@budibase/backend-core"
import { Document } from "@budibase/types"
import sdk from "../../sdk"

const migration = async () => {
  const allWorkspaceApps = await sdk.workspaceApps.fetch(context.getAppDB())
  const defaultWorkspaceApps = allWorkspaceApps.filter(w => w.isDefault)

  if (defaultWorkspaceApps.length > 1) {
    console.log(`Found ${defaultWorkspaceApps.length} default workspace apps`)

    const db = context.getAppDB()
    const docsToUpdate: Document[] = []
    const [workspaceAppToUse, ...workspaceAppToRemove] = defaultWorkspaceApps

    const allScreens = await sdk.screens.fetch()

    for (const workspaceApp of workspaceAppToRemove) {
      docsToUpdate.push(
        ...allScreens
          .filter(s => s.workspaceAppId === workspaceApp._id)
          .map(s => ({ ...s, workspaceAppId: workspaceAppToUse._id }))
      )
      docsToUpdate.push({
        ...workspaceApp,
        _deleted: true,
      })
    }

    docsToUpdate.push(
      ...allScreens
        .filter(s => !s.workspaceAppId)
        .map(s => ({ ...s, workspaceAppId: workspaceAppToUse._id }))
    )

    await db.bulkDocs(docsToUpdate)
  }
}

export default migration
