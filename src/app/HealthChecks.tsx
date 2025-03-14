import React from 'react'
import { useEffect, useState } from 'react'
import { useClient } from './hooks/useClient'

import ControlForm from './ControlForm'
import CheckResults from './CheckResult'
import { HealthCheckResult, HealthCheckMetaDataResult, HealthCheckMetaData, SystemCheckResult } from '../HealthCheckAPI'
import CheckResultSkeleton from './CheckResultSkeleton'
import { Alert, Title, Close } from '@zendeskgarden/react-notifications'

const defaultHttpOptions = {
  url: 'https://api.gridx.de/health-checks',
  headers: {
    Authorization: 'Token {{setting.gridXApiToken}}',
    'x-gridx-accountID': '{{setting.gridXOrgAccount}}',
  },
  contentType: 'application/json',
  accepts: 'application/json',
  secure: true,
  cors: false
}

// ZAF does not ship w/ the client types. By (sloppily) typing it here,
// we can use TS in this file w/ ignoring errors.
type IZafClient = {
  invoke: (...params: any) => void
  request: (...params: any) => Promise<any>
  metadata: (...params: any) => Promise<any>
}
type ApiErrorProps = {
  errorMessage: any
  onClose: () => void
}

const ApiError = ({ errorMessage, onClose }: ApiErrorProps) => {
  return (
    <Alert type="error">
      <Title>Error {errorMessage.status}</Title>
      {errorMessage.responseText}
      <Close aria-label="Close" onClick={onClose} />
    </Alert>
  )
}

const HealthChecks = () => {
  const [serialNo, setSerialNo] = useState('')
  const [result, setResult] = useState<SystemCheckResult[]>()
  const [loading, setLoading] = useState(false)
  const [checkInfo, setCheckInfo] = useState<HealthCheckMetaDataResult>()
  const [debug, setDebug] = useState(false)
  const [apiError, setApiError] = useState<string>()
  const resetApiError = () => setApiError(undefined)

  const client: IZafClient = useClient() as IZafClient

  useEffect(() => {
    async function init() {
      client.invoke('resize', { width: '100%', height: '450px' })

      const appMeta = await client.metadata()
      setDebug(!!appMeta.settings.debug)

      const options = {
        ...defaultHttpOptions,
        type: 'GET'
      }

      if (debug) {
        console.log('Requesting ', options)
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
    }
    init()
  }, [client])

  const check = () => {
    const options = {
      ...defaultHttpOptions,
      data: JSON.stringify({
        systems: [
          {
            gatewaySerialNumber: serialNo
          }
        ],
        //Run all checks
        checks: Object.values<HealthCheckMetaData>(checkInfo).map((c) => ({ type: c.type }))
      })
    }
    if (debug) {
      console.log('Requesting ', options)
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
      {apiError && <ApiError errorMessage={apiError} onClose={resetApiError} />}
      {!apiError && checkInfo && (
        <ControlForm checkFn={check} setSerialNo={setSerialNo} serialNo={serialNo}></ControlForm>
      )}
      {!loading && !apiError && checkInfo && <CheckResults result={result ?? []} checkInfo={checkInfo}></CheckResults>}
      {loading && !apiError && <CheckResultSkeleton />}
    </>
  )
}

export default HealthChecks
