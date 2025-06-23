import { useCallback, useEffect, useState } from 'react'
import { useClient } from './hooks/useClient.js'
import ControlForm from './components/ControlForm'
import LoadingIndicator from './components/LoadingIndicator'
import { Result } from './components/result'
import {
  HealthCheckInfo,
  HealthCheckMetaData,
  HealthCheckMetaDataResult,
  HealthCheckResult,
  SystemCheckResult
} from './components/api/HealthCheck'
import ApiError from './components/ApiError'
import { IZafClient } from './components/api/Zendesk'
import { StyledFlex } from './components/layout/StyledFlex'


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
  const [profiles, setProfiles] = useState<string[]>([])
  const [result, setResult] = useState<SystemCheckResult[] | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [checkInfo, setCheckInfo] = useState<HealthCheckInfo>()
  const [debug, setDebug] = useState(false)
  const [apiError, setApiError] = useState('')

  const resetApiError = () => setApiError('')
  const client: IZafClient = useClient() as IZafClient

  const getAvailableChecks = useCallback(async (options: any) => {
    return client
      .request(options)
      .then((response: HealthCheckMetaDataResult) => {
        setCheckInfo(
          response.checks.reduce((c, n) => {
            c[n.type] = n
            return c
          }, {} as HealthCheckInfo)
        )

        setProfiles(filterProfiles(response.checks))
        resetApiError()
      })
      .catch((err) => {
        setApiError(err)
      })
  },[client])

  useEffect(() => {
    async function init() {
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
  }, [client, getAvailableChecks])

  const check = async (serialNo: string, profile: string) => {
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
        profile
      })
    }

    if (debug) {
      console.log('Requesting ', options)
    }

    setLoading(true)
    client
      .request(options)
      .then((response: HealthCheckResult) => {
        setResult(response?.results ?? [])
        resetApiError()
      })
      .catch((err) => {
        setApiError(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const filterProfiles = (data: HealthCheckMetaData[]): string[] => {
    if (data === undefined || data.length === 0) {
      return []
    }

    // extract all profiles from checks
    const profiles: string[] = []
    data
      .map(check => check.profiles
        .map(profile => profiles
          .push(profile)))

    // filters all distinct profiles
    return profiles
      .filter((profile, i, arr) => arr
        .findIndex(p => p === profile) === i)
  }

  return (
    <StyledFlex>
      {apiError &&
        <ApiError
          errorMessage={apiError}
          onClose={resetApiError}
        />
      }
      {!apiError && checkInfo && (
        <ControlForm
          checkFn={check}
          setSerialNo={setSerialNo}
          serialNo={serialNo}
          profiles={profiles}
        />
      )}
      {!loading && !apiError && checkInfo &&
        <Result
          result={result ?? []}
          checkInfo={checkInfo}
        />
      }
      {loading && !apiError &&
        <LoadingIndicator />
      }
    </StyledFlex>
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
