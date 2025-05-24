export type System = {
  id: string
}

export type CheckType = string // dynamically retrieved from the API

export type IndividualCheckResult = {
  properties: Record<string, string>
  type: CheckType
  state: "passed" | "failed" | "skipped"
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