import { generateScreenID, getScreenParams } from "../../../db/utils"
import { context } from "@budibase/backend-core"
import { Screen } from "@budibase/types"

export async function fetch(): Promise<Screen[]> {
  const db = context.getAppDB()

  return (
    await db.allDocs<Screen>(
      getScreenParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(el => el.doc!)
}

export async function create(screen: Screen) {
  const db = context.getAppDB()

  const doc = await db.put({
    _id: generateScreenID(),
    ...screen,
  })
  return {
    _id: doc.id,
    _rev: doc.rev,
    ...screen,
  }
}
