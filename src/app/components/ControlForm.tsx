import React from 'react'
import { useState } from 'react'
import { useI18n } from '../hooks/useI18n'
import { Button } from '@zendeskgarden/react-buttons'
import { Grid } from '@zendeskgarden/react-grid'
import { Field, IInputProps, Input, InputGroup } from '@zendeskgarden/react-forms'

import { StyledGrid } from './StyledGrid'

const serialRegex = /^[A-Z](\d{3}-){5}(B|P)-X$/
const isSerial = (serial) => serialRegex.test(serial)

type validationResult = IInputProps['validation']

type ControlFormProps = {
  checkFn: () => void
  setSerialNo: (id: string) => void
  serialNo: string
}
const ControlForm = ({ checkFn, setSerialNo, serialNo }: ControlFormProps) => {
  const { t } = useI18n()

  const [inputValidationResult, setInputValidationResult] = useState(undefined as validationResult)

  const handleIdChange = (e) => {
    if (!isSerial(e.target.value)) {
      setInputValidationResult('warning')
    } else {
      setInputValidationResult(undefined)
    }
    setSerialNo(e.target.value)
  }

  return (
    <StyledGrid>
      <Grid.Row>
        <Grid.Col>
          <Field>
            <InputGroup>
              <Input
                value={serialNo}
                placeholder={t('ticket_sidebar.serial.label')}
                onChange={handleIdChange}
                validation={inputValidationResult}
              />
              <Button onClick={checkFn} disabled={!!inputValidationResult}>
                {t('ticket_sidebar.button')}
              </Button>
            </InputGroup>
          </Field>
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col>
          {serialNo && !isSerial(serialNo) && (
            <Field.Message validation="warning">{t('ticket_sidebar.serial.invalid')}</Field.Message>
          )}
        </Grid.Col>
      </Grid.Row>
    </StyledGrid>
  )
}

export default ControlForm
