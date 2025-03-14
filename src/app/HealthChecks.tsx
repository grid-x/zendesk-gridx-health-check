import React from 'react'
import { useEffect, useState } from 'react'
import { useClient } from './hooks/useClient'

import ControlForm from './ControlForm'
import CheckResults from './CheckResult'
import { HealthCheckResult, HealthCheckMetaDataResult, HealthCheckMetaData, SystemCheckResult } from '../HealthCheckAPI'
import CheckResultSkeleton from './CheckResultSkeleton'

const mockResult: HealthCheckResult = {
  results: [
    {
      results: [
        {
          properties: {},
          success: false,
          type: 'batteryCharged'
        },
        {
          properties: {},
          success: false,
          type: 'batteryDischarged'
        },
        {
          properties: {},
          success: true,
          type: 'connectionIssues'
        },
        {
          properties: {},
          success: true,
          type: 'consumptionProductionCorrelated'
        },
        {
          properties: {},
          success: true,
          type: 'applianceAuthenticated'
        },
        {
          properties: {},
          success: true,
          type: 'gridFeedInMissing'
        },
        {
          properties: {
            measuredAt: '2025-03-10T17:30:00Z',
            nightTimeTolerance: '1h0m0s',
            photovoltaic: '3205.60',
            sunrise: '2025-03-12T05:52:15Z',
            sunset: '2025-03-12T17:19:39Z',
            system: 'e34b419e-509b-4be0-b6ad-953d4a7a72b3',
            tolerance: '0.20'
          },
          success: false,
          type: 'nighttimePVProduction'
        },
        {
          properties: {},
          success: true,
          type: 'peakProductionExceeded'
        }
      ],
      system: {
        id: 'e34b419e-509b-4be0-b6ad-953d4a7a72b3'
      }
    }
  ]
}
const mockMetaData: HealthCheckMetaDataResult = {
  checks: [
    {
      type: 'gridFeedInMissing',
      name: 'Feeds into grid',
      description: 'Makes sure power is fed into the grid.'
    },
    {
      type: 'nighttimePVProduction',
      name: 'No PV production at night',
      description: 'Checks whether there was PV production during nighttime.'
    },
    {
      type: 'peakProductionExceeded',
      name: 'Production lower than capacity',
      description:
        'Checks whether the PV production exceeds the nominal power of the inverter. This is to\ndetect unusually high PV production for a system.System. The nominal power is simply an "easy" value to check\nagainst as it is manually set in Xenon. Issues can occur - for example - if the driver reports the wrong unit (Watts\ninstead of Kilowatts) or the nominal power is entered incorrectly.'
    },
    {
      type: 'applianceAuthenticated',
      name: 'Asset Authentication',
      description:
        "Check checks if authentication data is available as there is authentication required for some\nOEMs systems. However, there's arestrictio: sometimes it can still happen that the authentication data is not\nup-to date or not correct. Checking that would require a more elaborate check."
    },
    {
      type: 'batteryCharged',
      name: 'Battery Charged',
      description: 'Makes sure a battery is actually being charged from time to time.'
    },
    {
      type: 'batteryDischarged',
      name: 'Battery Discharged',
      description: 'Makes sure a battery is actually being discharged from time to time.'
    },
    {
      type: 'connectionIssues',
      name: 'Connection Issues',
      description:
        'Identifies whether a system has no more than n connection outages of more than x  minutes or if it has at least one outage of more than y minutes.'
    },
    {
      type: 'consumptionProductionCorrelated',
      name: 'Consumption/Production Correlates',
      description:
        'Checks if there is a correlation between the production and consumption time series of a\nsystem (they should not correlate too much, but usually still have some correlation, as at daytime PV production and\nconsumption normally are higher than at nighttime). It identifies systems where correlation coefficient is larger\nthan n (in non-0-production times).'
    }
  ]
}

const defaultHttpOptions = {
  url: 'https://api.gridx.de/health-checks',
  headers: {
    Authorization: 'Token {{setting.gridXApiToken}}',
    'content-type': 'application/json',
    accept: 'application/json'
  },
  accepts: 'application/json',
  secure: true,
  cors: false
}

// ZAF does not ship w/ the client types. By (sloppily) typing it, we can
// use TS in this file w/ ignoring errors.
type IZafClient = {
  invoke: (...params: any) => void
  request: (...params: any) => Promise<any>
}

const HealthChecks = () => {
  const client: IZafClient = useClient() as IZafClient

  const [gatewaySn, setGatewaySn] = useState('E074-050-000-000-161-P-X')
  const [result, setResult] = useState<SystemCheckResult[]>()
  const [loading, setLoading] = useState(false)
  const [checkInfo, setCheckInfo] = useState<HealthCheckMetaDataResult>()

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
      })
      .catch((err) => {
        console.error(err)
        //FIXME: un-set result
        setCheckInfo(
          mockMetaData.checks.reduce((c, n) => {
            c[n.type] = n
            return c
          }, {} as HealthCheckMetaDataResult)
        )
      })
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
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
        //FIXME: un-set result
        setResult(mockResult.results)
      })
  }

  return (
    <>
      <ControlForm checkFn={check} setGatewaySn={setGatewaySn} gatewaySn={gatewaySn}></ControlForm>
      {!loading && checkInfo && <CheckResults result={result ?? []} checkInfo={checkInfo}></CheckResults>}
      {loading && <CheckResultSkeleton />}
    </>
  )
}

export default HealthChecks
