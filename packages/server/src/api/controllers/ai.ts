import {
  GenerateScreenRequest,
  GenerateScreenResponse,
  GenerateTablesRequest,
  GenerateTablesResponse,
  UserCtx,
} from "@budibase/types"
import { ai } from "@budibase/pro"
import sdk from "../../sdk"

export async function generateTables(
  ctx: UserCtx<GenerateTablesRequest, GenerateTablesResponse>
) {
  const { prompt } = ctx.request.body

  const tableGenerator = await ai.TableGeneration.init({
    generateTablesDelegate: sdk.ai.helpers.generateTables,
    generateDataDelegate: sdk.ai.helpers.generateRows,
  })

  const createdTables = await tableGenerator.generate(
    prompt,
    ctx.user._id || ""
  )

  ctx.body = {
    createdTables,
  }
}

export async function generateScreen(
  ctx: UserCtx<GenerateScreenRequest, GenerateScreenResponse>
) {
  const { prompt } = ctx.request.body

  const screenGenerator = await ai.ScreenGeneration.init({
    getSources: sdk.tables.getAllTables,
    generateScreen: sdk.ai.helpers.generateScreen,
  })

  const screen = await screenGenerator.generate(prompt)

  ctx.body = {
    screen,
  }
}
