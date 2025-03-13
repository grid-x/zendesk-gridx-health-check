import React from 'react'
import { useState } from 'react'
import { useI18n } from './hooks/useI18n'
import { Button } from '@zendeskgarden/react-buttons'
import { Row, Col } from '@zendeskgarden/react-grid'
import { Field, IInputProps, Input, InputGroup, Message } from '@zendeskgarden/react-forms'

import { StyledGrid } from './StyledGrid'

const serialRegex = /^[A-Z](\d{3}-){5}(B|P)-X$/
const isSerial = (serial) => serialRegex.test(serial)

type ControlFormProps = {
  checkFn: () => void
  setGatewaySn: (sn: string) => void
  gatewaySn: string
}
const ControlForm = ({ checkFn, setGatewaySn, gatewaySn }: ControlFormProps) => {
  const { t } = useI18n()

  const [validationResult, setValidationResult] = useState<IInputProps["validation"]>(undefined)

  const handleGatewaySnChange = (e) => {
    if (!isSerial(e.target.value)) {
      setValidationResult('warning')
    } else {
      setValidationResult(undefined)
    }
    setGatewaySn(e.target.value)
  }

  return (
    <StyledGrid>
      <Row>
        <Col>
          <Field>
            <InputGroup>
              <Input
                value={gatewaySn}
                placeholder={t('ticket_sidebar.serial.label')}
                onChange={handleGatewaySnChange}
                validation={validationResult}
              />
              <Button isPrimary onClick={checkFn} disabled={!!validationResult}>
                {t('ticket_sidebar.button')}
              </Button>
            </InputGroup>
          </Field>
        </Col>
      </Row>
      <Row>
        <Col>
          {gatewaySn && !isSerial(gatewaySn) && (
            <Message validation="warning">{t('ticket_sidebar.serial.invalid')}</Message>
          )}
        </Col>
      </Row>
    </StyledGrid>
  )
}

export default ControlForm
