import sdk from "../../.."
import { helpers } from "@budibase/shared-core"
import { ai } from "@budibase/pro"

export async function generateScreen(screen: ai.ScreenStructure) {
  const allScrens = await sdk.screens.fetch()
  const name = helpers.getSequentialName(
    allScrens.map(s => s.name),
    screen.screen.name
  )
  console.error(name)
}
