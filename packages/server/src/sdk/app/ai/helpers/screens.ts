import sdk from "../../.."
import { helpers, utils } from "@budibase/shared-core"
import { ai } from "@budibase/pro"
import { Component, Screen } from "@budibase/types"
import { v4 } from "uuid"
import { context, HTTPError } from "@budibase/backend-core"

async function getSourceByName(name: string) {
  const tables = await sdk.tables.getAllTables()
  return tables.find(t => t.name === name)
}

async function mapSource(sourceName: string) {
  const source = await getSourceByName(sourceName)
  if (!source) {
    throw new HTTPError(`Source ${sourceName} not found`, 500)
  }
  return {
    label: source.name,
    tableId: source._id!,
    type: "table",
    resourceId: source._id!,
  }
}

async function mapComponent(component: ai.Component): Promise<Component> {
  const { type } = component
  switch (type) {
    case ai.ComponentType.Column:
    case ai.ComponentType.Row: {
      const children: Component[] = []
      for (const child of component.children) {
        children.push(await mapComponent(child))
      }

      return {
        _id: v4(),
        _instanceName: "New Container",
        _component: "@budibase/standard-components/container",
        _styles: {},
        _children: children,
        layout: "flex",
        direction: type === ai.ComponentType.Column ? "column" : "row",
        vAlign: component.vAlign,
        hAlign: component.hAlign,
        gap: component.gap[0],
      }
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
        _instanceName: "New Text Field",
        _component: "@budibase/standard-components/stringfield",
        _styles: {},
        label: component.label,
        placeholder: component.placeholder,
      }
    case ai.ComponentType.FormBlock:
      return {
        _id: v4(),
        _instanceName: "New Form",
        _component: "@budibase/standard-components/formblock",
        _styles: {},
        title: component.title,
        dataSource: await mapSource(component.datasource),
        actionType: component.actionType,
      }
    case ai.ComponentType.TableBlock:
      return {
        _id: v4(),
        _instanceName: "New Table",
        _component: "@budibase/standard-components/gridblock",
        _styles: {},
        table: await mapSource(component.datasource),
      }
    case ai.ComponentType.ChartBlock: {
      const { chartType } = component
      switch (chartType) {
        case "pie":
          return {
            _id: v4(),
            _instanceName: "New Chart",
            _component: "@budibase/standard-components/chartblock",
            _styles: {},
            title: component.title,
            dataSource: await mapSource(component.datasource),
            chartType: component.chartType,
            labelColumn: component.labelColumn,
            valueColumn: component.valueColumn,
            palette: "Palette 1",
            height: component.height.toString(),
          }
        case "bar":
          return {
            _id: v4(),
            _instanceName: "New Chart",
            _component: "@budibase/standard-components/chartblock",
            _styles: {},
            title: component.title,
            dataSource: await mapSource(component.datasource),
            chartType: component.chartType,
            labelColumn: component.labelColumn,
            valueColumns: component.valueColumns,
            palette: "Palette 1",
            height: component.height.toString(),
          }

        default:
          throw utils.unreachable(chartType)
      }
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

  const children: Component[] = []
  for (const child of screen.components) {
    children.push(await mapComponent(child))
  }
  const route = `/${name.replace(/ /g, "").toLowerCase()}`

  const result = await sdk.screens.create({
    name: name,
    routing: {
      route,
      roleId: "BASIC",
    },
    showNavigation: true,
    props: {
      _id: v4(),
      _component: "@budibase/standard-components/container",
      _instanceName: "Screen",
      _styles: {},
      _children: children,
    },
  })

  const metadata = await sdk.applications.metadata.tryGet()
  if (metadata?.navigation) {
    metadata.navigation.links ??= []
    metadata.navigation.links.push({
      text: name,
      url: route,
    })
    const db = context.getAppDB()
    await db.put(metadata)
  }

  return result
}
