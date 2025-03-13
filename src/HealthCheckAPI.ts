export type System = {
  id: string
}

export type CheckType = string // dynamically retrieved from the API

export type IndividualCheckResult = {
  properties: Record<string, string>
  type: CheckType
  success: boolean
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
}

export type HealthCheckMetaDataResult = {
  checks: HealthCheckMetaData[]
}