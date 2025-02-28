import { useEffect, useState } from 'react'
import { useClient } from '../hooks/useClient'
import { useI18n } from '../hooks/useI18n'
import { Button } from '@zendeskgarden/react-buttons'
import { Grid, Row } from '@zendeskgarden/react-grid'
import { Field, Label, Input, Message } from '@zendeskgarden/react-forms'

import styled from 'styled-components'

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const isUuid = (uuid) => uuidRegex.test(uuid)

const checks = {
  emsActivated: 'EMS activated',
  nighttimePvProduction: 'Nighttime PV Production',
  connectionIssues: 'Appliance Connection Issue',
  gridFeedInMissing: 'Grid FeedIn',
  consumptionProductionCorrelated: 'PV Production vs. Consumption',
  energyFlow: 'Energy Flow',
  deviceAuthentication: 'Appliance Authentication',
  chargingSessions: 'EV Never Charged',
  productTypeConfigComplete: 'Product type config complete',
  batteryCharge: 'Battery Never charged',
  batteryDischarge: 'Battery Never discharged',
  peakExceeded: 'PV Production Exceeds Installed Capacity',
  correctPhaseRotation: 'Balanced Phase Rotation',
  cosPhiValid: 'cosPhi'
}

const mockResult = {
  results: [
    {
      results: [
        {
          properties: {
            measuredAt: '2025-02-26T17:15:00Z',
            nightTimeTolerance: '1h0m0s',
            photovoltaic: '3548.98',
            sunrise: '2025-02-28T06:22:08Z',
            sunset: '2025-02-28T17:14:30Z',
            system: 'cef41bdc-797e-4ced-a787-7d92af12ca43',
            tolerance: '20.00'
          },
          success: false,
          type: 'nighttimePvProduction'
        },
        {
          properties: {},
          success: true,
          type: 'peakExceeded'
        }
      ],
      system: {
        id: 'cef41bdc-797e-4ced-a787-7d92af12ca43'
      }
    }
  ]
}

const TicketSideBar = () => {
  const client = useClient()
  const { t } = useI18n()

  const [systemId, setSystemId] = useState('')
  const [result, setResult] = useState({})
  const [validationResult, setValidationResult] = useState('warning')

  useEffect(() => {
    client.invoke('resize', { width: '100%', height: '450px' })
  }, [client])

  const check = () => {
    const options = {
      url: 'https://api.gridx.de/health-checks',
      type: 'POST',
      headers: {
        Authorization: 'Token {{setting.gridXApiToken}}',
        'content-type': 'application/json',
        accept: 'application/json'
      },
      accepts: 'application/json',
      secure: true,
      cors: true,
      data: JSON.stringify({
        systems: [{ id: systemId }],
        checks: [{ type: 'peakExceeded' }, { type: 'nighttimePvProduction' }]
      })
    }

    return client
      .request(options)
      .then((response) => {
        setResult(response)
      })
      .catch((err) => {
        console.error(err)
        setResult(mockResult)
      })
  }

  const handleSystemIdChange = (e) => {
    if (!isUuid(e.target.value)) {
      setValidationResult('warning')
    } else {
      setValidationResult('')
    }
    setSystemId(e.target.value)
  }

  return (
    <GridContainer>
      <Row justifyContent="center">
        <Field>
          <Label>System ID</Label>
          <Input value={systemId} onChange={handleSystemIdChange} validation={validationResult} />
          {!isUuid(systemId) && <Message validation="warning">SystemID must be a UUID</Message>}
        </Field>
      </Row>
      <Row justifyContent="center">
        <Button isPrimary onClick={check} disabled={validationResult !== ''}>
          Run All Checks
        </Button>
      </Row>
      <Row justifyContent="center">
        <pre
          style={{
            width: '300px',
            height: '200px',
            border: '1px solid grey',
            backgroundColor: 'beige',
            overflow: 'scroll'
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      </Row>
    </GridContainer>
  )
}

const GridContainer = styled(Grid)`
  display: grid;
  gap: ${(props) => props.theme.space.sm};
`

export default TicketSideBar
