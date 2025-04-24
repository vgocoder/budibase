import sdk from "../../.."
import { helpers, utils } from "@budibase/shared-core"
import { ai } from "@budibase/pro"
import { Component, Screen } from "@budibase/types"
import { v4 } from "uuid"

function mapComponent(component: ai.Component): Component {
  const { type } = component
  switch (type) {
    case ai.ComponentType.Container:
      return {
        _id: v4(),
        _instanceName: "New Container",
        _component: "@budibase/standard-components/container",
        _styles: {},
        _children: component.children.map(mapComponent),
      }
    case ai.ComponentType.Label:
      return {
        _id: v4(),
        _instanceName: "New Label",
        _component: "@budibase/standard-components/textv2",
        _styles: {},
        text: component.text,
      }
    case ai.ComponentType.TextField:
      return {
        _id: v4(),
        _instanceName: "New Container",
        _component: "@budibase/standard-components/stringfield",
        _styles: {},
        label: component.label,
        placeholder: component.placeholder,
      }
    default:
      throw utils.unreachable(type)
  }
}

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
      _instanceName: "Screen",
      _styles: {},
      _children: screen.components.map(mapComponent),
    },
  })
  return result
}
