import React from 'react'
import { useEffect, useState } from 'react'
import { useClient } from './hooks/useClient'

import ControlForm from './ControlForm'
import CheckResults from './CheckResult'
import { HealthCheckResult, HealthCheckMetaDataResult, HealthCheckMetaData, SystemCheckResult } from '../HealthCheckAPI'
import CheckResultSkeleton from './CheckResultSkeleton'
import { Alert, Title } from '@zendeskgarden/react-notifications'

const defaultHttpOptions = {
  url: 'https://api.gridx.de/health-checks',
  headers: {
    Authorization: 'Token {{setting.gridXApiToken}}',
    'x-gridx-accountID': '{{setting.gridXOrgAccount}}',
    'content-type': 'application/json',
    accept: 'application/json'
  },
  accepts: 'application/json',
  secure: true,
  cors: false
}

// ZAF does not ship w/ the client types. By (sloppily) typing it here,
// we can use TS in this file w/ ignoring errors.
type IZafClient = {
  invoke: (...params: any) => void
  request: (...params: any) => Promise<any>
}
type ApiErrorProps = {
  errorMessage: any 
}

const ApiError = ({ errorMessage }: ApiErrorProps) => {
  return (
    <Alert type="error">
      <Title>Error {errorMessage.status}</Title>
      {errorMessage.responseText}
    </Alert>
  )
}

/*
 <Alert type="error">
      <Alert.Title>Error</Alert.Title>
      {errorMessage}
    </Alert>
*/
const HealthChecks = () => {
  const client: IZafClient = useClient() as IZafClient

  const [gatewaySn, setGatewaySn] = useState('E074-050-000-000-161-P-X')
  const [result, setResult] = useState<SystemCheckResult[]>()
  const [loading, setLoading] = useState(false)
  const [checkInfo, setCheckInfo] = useState<HealthCheckMetaDataResult>()
  const [apiError, setApiError] = useState<string>()
  const resetApiError = () => setApiError(undefined)

  useEffect(() => {
    client.invoke('resize', { width: '100%', height: '450px' })

    const options = {
      ...defaultHttpOptions,
      type: 'GET'
    }
    client
      .request(options)
      .then((response: HealthCheckMetaDataResult) => {
        setCheckInfo(
          response.checks.reduce((c, n) => {
            c[n.type] = n
            return c
          }, {} as HealthCheckMetaDataResult)
        )
        resetApiError()
      })
      .catch((err) => setApiError(err))
  }, [client])

  const check = () => {
    const options = {
      ...defaultHttpOptions,
      data: JSON.stringify({
        systems: [{ sn: gatewaySn }],
        //Run all checks
        checks: Object.values<HealthCheckMetaData>(checkInfo).map((c) => ({ type: c.type }))
      })
    }

    setLoading(true)
    return client
      .request(options)
      .then((response: HealthCheckResult) => {
        setLoading(false)
        setResult(response?.results ?? [])
        resetApiError()
      })
      .catch((err) => {
        setApiError(err)
        setLoading(false)
      })
  }

  return (
    <>
      {apiError && <ApiError errorMessage={apiError} />}
      {!apiError && checkInfo && (
        <ControlForm checkFn={check} setGatewaySn={setGatewaySn} gatewaySn={gatewaySn}></ControlForm>
      )}
      {!loading && !apiError && checkInfo && <CheckResults result={result ?? []} checkInfo={checkInfo}></CheckResults>}
      {loading && !apiError && <CheckResultSkeleton />}
    </>
  )
}

export default HealthChecks
