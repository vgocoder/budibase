import sdk from "../../.."
import { helpers } from "@budibase/shared-core"
import { ai } from "@budibase/pro"
import { Screen } from "@budibase/types"

export async function generateScreen(
  screen: ai.ScreenStructure
): Promise<Screen> {
  const allScrens = await sdk.screens.fetch()
  const name = helpers.getSequentialName(
    allScrens.map(s => s.name),
    screen.screen.name
  )
  console.error(name)
  return { _id: "123" } as any
}
