import sdk from "../../.."
import { helpers } from "@budibase/shared-core"
import { ai } from "@budibase/pro"
import { Screen } from "@budibase/types"
import { v4 } from "uuid"

export async function generateScreen({
  screen,
}: ai.ScreenStructure): Promise<Screen> {
  const allScrens = await sdk.screens.fetch()
  const name = helpers.getSequentialName(
    allScrens.map(s => s.name),
    screen.name
  )

  const result = await sdk.screens.create({
    name: name,
    routing: {
      route: `/${name.replace(/ /g, "").toLowerCase()}`,
      roleId: "BASIC",
    },
    props: {
      _id: v4(),
      _component: "@budibase/standard-components/container",
      _instanceName: "Root",
      _styles: {},
    },
  })
  return result
}
