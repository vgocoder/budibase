/**
 * Operator options for lucene queries
 */
export {
  OperatorOptions,
  SqlNumberTypeRangeMap,
  DEFAULT_BB_DATASOURCE_ID,
} from "@budibase/shared-core"
export { Feature as Features } from "@budibase/types"
import { BpmCorrelationKey } from "@budibase/shared-core"
import { FieldType, BBReferenceFieldSubType } from "@budibase/types"

export const BannedSearchTypes = [
  FieldType.LINK,
  FieldType.ATTACHMENT_SINGLE,
  FieldType.ATTACHMENTS,
  FieldType.FORMULA,
  FieldType.JSON,
  FieldType.ATTACHMENT_SINGLE,
  FieldType.SIGNATURE_SINGLE,
  "jsonarray",
  "queryarray",
]

// Cookie names
export const Cookies = {
  Auth: "budibase:auth",
  CurrentApp: "budibase:currentapp",
  ReturnUrl: "budibase:returnurl",
  AccountReturnUrl: "budibase:account:returnurl",
  OnboardingProcessCorrelationKey: BpmCorrelationKey.ONBOARDING,
}

// Table names
export const TableNames = {
  USERS: "ta_users",
}

export const BudibaseRoles = {
  AppUser: "appUser",
  Developer: "developer",
  Creator: "creator",
  Admin: "admin",
  Owner: "owner",
}

export const BudibaseRoleOptionsOld = [
  {
    label: "Developer",
    value: BudibaseRoles.Developer,
  },
]
export const BudibaseRoleOptions = [
  {
    label: "Account admin",
    value: BudibaseRoles.Admin,
    subtitle: "Has full access to all apps and settings in your account",
    sortOrder: 1,
  },
  {
    label: "Creator",
    value: BudibaseRoles.Creator,
    subtitle: "Can create and edit apps they have access to",
    sortOrder: 2,
  },
  {
    label: "App user",
    value: BudibaseRoles.AppUser,
    subtitle: "Can only use published apps they have access to",
    sortOrder: 3,
  },
]
export const ExtendedBudibaseRoleOptions = [
  {
    label: "Account holder",
    value: BudibaseRoles.Owner,
    sortOrder: 0,
  },
]
  .concat(BudibaseRoleOptions)
  .concat(BudibaseRoleOptionsOld)

export const PlanType = {
  FREE: "free",
  TEAM: "team",
  PRO: "pro",
  BUSINESS: "business",
  PREMIUM: "premium",
  ENTERPRISE: "enterprise",
  ENTERPRISE_BASIC_TRIAL: "enterprise_basic_trial",
}

/**
 * API version header attached to all requests.
 * Version changelog:
 * v1:
 *   - Coerce types for search endpoint
 */
export const ApiVersion = "1"

// Role IDs
export const Roles = {
  ADMIN: "ADMIN",
  POWER: "POWER",
  BASIC: "BASIC",
  PUBLIC: "PUBLIC",
  BUILDER: "BUILDER",
  CREATOR: "CREATOR",
}

export const EventPublishType = {
  ENV_VAR_UPGRADE_PANEL_OPENED: "environment_variable_upgrade_panel_opened",
}

export const ContextScopes = {
  Local: "local",
  Global: "global",
}

export const TypeIconMap = {
  [FieldType.STRING]: "text",
  [FieldType.OPTIONS]: "select-multi",
  [FieldType.DATETIME]: "calendar",
  [FieldType.BARCODEQR]: "camera",
  [FieldType.SIGNATURE_SINGLE]: "edit",
  [FieldType.LONGFORM]: "text-align-justify-last-left",
  [FieldType.ARRAY]: "duplicate",
  [FieldType.NUMBER]: "text-numbers",
  [FieldType.BOOLEAN]: "radio-button",
  [FieldType.ATTACHMENTS]: "asset",
  [FieldType.ATTACHMENT_SINGLE]: "image",
  [FieldType.LINK]: "link",
  [FieldType.FORMULA]: "effects",
  [FieldType.AI]: "magic-wand",
  [FieldType.JSON]: "prompt",
  [FieldType.BIGINT]: "text-numbers",
  [FieldType.AUTO]: "data",
  [FieldType.BB_REFERENCE]: {
    [BBReferenceFieldSubType.USER]: "user-group",
    [BBReferenceFieldSubType.USERS]: "user-group",
  },
  [FieldType.BB_REFERENCE_SINGLE]: {
    [BBReferenceFieldSubType.USER]: "user",
  },
}

export const OptionColours = [...new Array(12).keys()].map(idx => {
  return `hsla(${((idx + 1) * 222) % 360}, 90%, 75%, 0.3)`
})

export const FilterOperator = {
  ANY: "any",
  ALL: "all",
}

export const OnEmptyFilter = {
  RETURN_ALL: "all",
  RETURN_NONE: "none",
}

export const FilterValueType = {
  BINDING: "Binding",
  VALUE: "Value",
}

export const FieldPermissions = {
  WRITABLE: "writable",
  READONLY: "readonly",
  HIDDEN: "hidden",
}
