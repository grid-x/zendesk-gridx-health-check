import React from 'react'
import { useEffect, useState } from 'react'
import { useClient } from './hooks/useClient'

import ControlForm from './components/ControlForm'

import LoadingIndicator from './components/LoadingIndicator'
import { Result } from './components/result'
import {
  HealthCheckMetaData,
  HealthCheckMetaDataResult,
  HealthCheckResult,
  SystemCheckResult
} from './components/api/HealthCheck'
import ApiError from './components/ApiError'
import { IZafClient } from './components/api/Zendesk'

const defaultHttpOptions = {
  url: 'https://api.gridx.de/health-checks',
  headers: {
    Authorization: 'Token {{setting.gridXApiToken}}'
  },
  contentType: 'application/json',
  accepts: 'application/json',
  secure: true,
  cors: false
}

const HealthChecks = () => {
  const [serialNo, setSerialNo] = useState('')
  const [result, setResult] = useState([] as SystemCheckResult[])
  const [loading, setLoading] = useState(false)
  const [checkInfo, setCheckInfo] = useState({})
  const [debug, setDebug] = useState(false)
  const [apiError, setApiError] = useState('')
  const resetApiError = () => setApiError('')

  const client: IZafClient = useClient() as IZafClient

  useEffect(() => {
    async function init() {
      client.invoke('resize', { width: '100%', height: '100%' })

      const appMeta = await client.metadata()
      const debugSetting = !!appMeta.settings.debug
      setDebug(debugSetting)
      
      const serialFieldID = appMeta?.settings?.gridXSerialNumberFieldId
      if (serialFieldID) {
        const sn = await getSerialFromCustomField(client, serialFieldID)
        if (debugSetting) {
          console.log(`Setting serial number ${sn} from custom field ${serialFieldID}`)
        }
        setSerialNo(sn)
      }

      const options = {
        ...defaultHttpOptions,
        type: 'GET'
      }

      if (debugSetting) {
        console.log('Requesting ', options)
      }

     await getAvailableChecks(options)
    }
    init()
  }, [client])

  const check = () => {
    const options = {
      ...defaultHttpOptions,
      type: 'POST',
      data: JSON.stringify({
        systems: [
          {
            gatewaySerialNumber: serialNo
          }
        ],
        //Run all checks
        checks: Object.values<HealthCheckMetaData>(checkInfo)
          .filter((c) => c.type != 'connectionIssues') //FIXME: Include when we figure out how not to time out
          .map((c) => ({ type: c.type }))
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
        client.invoke('resize', { width: '100%', height: '75vh' })
        setResult(response?.results ?? [])
        resetApiError()
      })
      .catch((err) => {
        setApiError(err)
        setLoading(false)
      })
  }

  const getAvailableChecks = (options: any) => {
    return client
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

  return (
    <>
      {apiError && <ApiError errorMessage={apiError} onClose={resetApiError} />}
      {!apiError && checkInfo && (
        <ControlForm checkFn={check} setSerialNo={setSerialNo} serialNo={serialNo}></ControlForm>
      )}
      {!loading && !apiError && checkInfo && <Result result={result ?? []} checkInfo={checkInfo}></Result>}
      {loading && !apiError && <LoadingIndicator />}
    </>
  )
}

const getSerialFromCustomField = async (client: IZafClient, serialFieldID: string): Promise<string> => {
  const serialFieldKey = `ticket.customField:custom_field_${serialFieldID}`
  return client
    .get(serialFieldKey)
    .then((serialField) => serialField?.[serialFieldKey])
    .catch((err) => console.error(err))
}

export default HealthChecks
