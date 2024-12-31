import { helpers } from "@budibase/shared-core"
import { TypeIconMap } from "../constants"

export const getColumnIcon = column => {
  if (column.schema.icon) {
    return column.schema.icon
  }
  if (column.calculationType) {
    return "calculator"
  }
  if (column.schema.autocolumn) {
    return "magic-wand"
  }
  if (helpers.schema.isDeprecatedSingleUserColumn(column.schema)) {
    return "user"
  }
  const { type, subtype } = column.schema
  const result =
    typeof TypeIconMap[type] === "object" && subtype
      ? TypeIconMap[type][subtype]
      : TypeIconMap[type]

  return result || "Text"
}
