import sdk from "../../.."
import { helpers, utils } from "@budibase/shared-core"
import { ai } from "@budibase/pro"
import { Component, Screen } from "@budibase/types"
import { v4 } from "uuid"

function mapDatasource(datasourceName: string) {
  const datasources = {
    Users: {
      label: "Users",
      tableId: "ta_users",
      type: "table",
      resourceId: "ta_users",
    },
    Employees: {
      label: "Employees",
      tableId: "ta_bb_employee",
      type: "table",
      datasourceName: "Sample Data",
      resourceId: "ta_bb_employee",
    },
    Expenses: {
      label: "Expenses",
      tableId: "ta_bb_expenses",
      type: "table",
      datasourceName: "Sample Data",
      resourceId: "ta_bb_expenses",
    },
    Inventory: {
      label: "Inventory",
      tableId: "ta_bb_inventory",
      type: "table",
      datasourceName: "Sample Data",
      resourceId: "ta_bb_inventory",
    },
    Jobs: {
      label: "Jobs",
      tableId: "ta_bb_jobs",
      type: "table",
      datasourceName: "Sample Data",
      resourceId: "ta_bb_jobs",
    },
  }

  return datasources[datasourceName]
}

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
        size: component.fontSize,
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
    case ai.ComponentType.FormBlock:
      return {
        _id: v4(),
        _instanceName: "New Container",
        _component: "@budibase/standard-components/formblock",
        _styles: {},
        title: component.title,
        dataSource: mapDatasource(component.datasource),
        actionType: component.actionType,
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
