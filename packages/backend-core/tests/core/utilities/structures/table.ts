import { TableId } from "@budibase/types"
import { generator } from "./generator"

export function id() {
  return generator.guid() as TableId
}
