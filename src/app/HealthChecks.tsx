import React, { useEffect, useState } from 'react'
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
  const [result, setResult] = useState<SystemCheckResult>([])
  const [loading, setLoading] = useState(false)
  const [checkInfo, setCheckInfo] = useState<HealthCheckMetaData>([])
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

  const check = (profile: string) => {
    const options = {
      ...defaultHttpOptions,
      type: 'POST',
      data: JSON.stringify({
        systems: [
          {
            gatewaySerialNumber: serialNo
          }
        ],
        checks: [],
        profile: profile
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
        setCheckInfo(response.checks)
        resetApiError()
      })
      .catch((err) => setApiError(err))
  }

  const filterProfiles = (data: HealthCheckMetaData[]): string[] => {
    if (data === undefined || data.length === 0) {
      return []
    }

    // extract all profiles from checks
    let profiles: string[] = []
    data.map(check => check.profiles.map(profile => profiles.push(profile)))

    // filters all distinct profiles
    return profiles.filter((profile, i, arr) => arr.findIndex(p => p === profile) === i)
  }

  return (
    <>
      {apiError && <ApiError errorMessage={apiError} onClose={resetApiError} />}
      {!apiError && checkInfo && (
        <ControlForm
          checkFn={check}
          setSerialNo={setSerialNo}
          serialNo={serialNo}
          profiles={filterProfiles(checkInfo)}
        />
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
