import React, { useCallback, useState } from 'react'
import { useI18n } from '../hooks/useI18n'
import { Grid } from '@zendeskgarden/react-grid'
import { Field, IInputProps, Input, InputGroup } from '@zendeskgarden/react-forms'
import { StyledGrid } from './StyledGrid'
import { IMenuProps, Item, Menu } from '@zendeskgarden/react-dropdowns'
import { capitalize } from '../utils/text'

const serialRegex = /^[A-Z](\d{3}-){5}(B|P)-X$/
const isSerial = (serial) => serialRegex.test(serial)

type ControlFormProps = {
  checkFn: (profile: string) => void
  setSerialNo: (id: string) => void
  serialNo: string
  profiles: string[]
}

const ControlForm = ({ checkFn, setSerialNo, serialNo, profiles }: ControlFormProps) => {
  const { t } = useI18n()

  const [inputValidationResult, setInputValidationResult] = useState<IInputProps['validation']>(undefined)

  const handleChange = useCallback<NonNullable<IMenuProps['onChange']>>(
    (changes: { value: string }) => {
      changes.value && checkFn(changes.value)
    }, [])

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
                <Menu
                  button={t('ticket_sidebar.button')}
                  onChange={handleChange}
                  placement="bottom-end"
                >
                  {profiles.map((profile: string, i: number) => (
                    <Item key={i} value={profile}>
                      {capitalize(profile)}
                    </Item>
                  ))}
                </Menu>
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
