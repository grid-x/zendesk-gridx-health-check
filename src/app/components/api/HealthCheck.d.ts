export type System = {
  id: string
  gatewaySerialNumber: string
  wizardStatus: string
}

export type CheckType = string // dynamically retrieved from the API

export type CheckResultState = "PASSED" | "FAILED" | "SKIPPED"

export type IndividualCheckResult = {
  properties: Record<string, string>
  type: CheckType
  state: CheckResultState
}

export type SystemCheckResult = {
  system: System
  results: IndividualCheckResult[]
}

export type HealthCheckResult = {
  results: SystemCheckResult[]
}

export type HealthCheckMetaData = {
  type: CheckType
  name: string
  description: string
  profiles: string[]
}

export type HealthCheckMetaDataResult = {
  checks: HealthCheckMetaData[]
}

export type HealthCheckInfo = Record<string, HealthCheckMetaData>