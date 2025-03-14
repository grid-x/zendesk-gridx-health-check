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
  setSerialNo: (id: string) => void
  serialNo: string
}
const ControlForm = ({ checkFn, setSerialNo, serialNo }: ControlFormProps) => {
  const { t } = useI18n()

  const [validationResult, setValidationResult] = useState<IInputProps["validation"]>(undefined)

  const handleIdChange = (e) => {
    if (!isSerial(e.target.value)) {
      setValidationResult('warning')
    } else {
      setValidationResult(undefined)
    }
    setSerialNo(e.target.value)
  }

  return (
    <StyledGrid>
      <Row>
        <Col>
          <Field>
            <InputGroup>
              <Input
                value={serialNo}
                placeholder={t('ticket_sidebar.serial.label')}
                onChange={handleIdChange}
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
          {serialNo && !isSerial(serialNo) && (
            <Message validation="warning">{t('ticket_sidebar.serial.invalid')}</Message>
          )}
        </Col>
      </Row>
    </StyledGrid>
  )
}

export default ControlForm
