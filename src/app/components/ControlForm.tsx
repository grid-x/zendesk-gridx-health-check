import { ReactNode, useCallback, useState } from 'react'
import { useI18n } from '../hooks/useI18n.js'
import { Grid } from '@zendeskgarden/react-grid'
import { Field, IInputProps, Input, InputGroup } from '@zendeskgarden/react-forms'
import { IMenuProps, Item, Menu } from '@zendeskgarden/react-dropdowns'
import { capitalize } from '../utils/text'

const serialRegex = /^[A-Z](\d{3}-){5}(B|P)-X$/
const isSerial = (serial: string) => serialRegex.test(serial)

type ControlFormProps = {
  checkFn: (serialNo: string, profile: string) => void
  setSerialNo: (id: string) => void
  serialNo: string
  profiles?: string[]
}

const ControlForm = ({ checkFn, setSerialNo, serialNo, profiles }: ControlFormProps) => {
  const { t } = useI18n()
  const [inputValidationResult, setInputValidationResult] = useState<IInputProps['validation']>(undefined)

  const handleChange = useCallback<NonNullable<IMenuProps['onChange']>>(
    (changes) => {
      changes.value && checkFn(serialNo, changes.value)
    }, [checkFn, serialNo])

  const handleIdChange = (e: any) => {
    if (!isSerial(e.target.value)) {
      setInputValidationResult('warning')
    } else {
      setInputValidationResult(undefined)
    }
    setSerialNo(e.target.value)
  }

  const itemMeta = (profile: string): ReactNode => {
    switch (profile) {
      case 'quick':
        return <Item.Meta>Includes fast executing checks</Item.Meta>
      case 'extended':
        return <Item.Meta>Includes data heavy checks</Item.Meta>
      default:
        return null
    }
  }

  return (
    <Grid>
      <Grid.Row>
        <Grid.Col>
          <Field>
            <InputGroup>
              <Input
                value={serialNo}
                placeholder={t('ticket_sidebar.serial.label')}
                onChange={handleIdChange}
                validation={inputValidationResult}
                style={{ textOverflow: 'ellipsis' }}
              />
              <Menu
                button={t('ticket_sidebar.button')}
                onChange={handleChange}
              >
                {profiles?.map((profile: string, i: number) => (
                  <Item key={i} value={profile}>
                    {capitalize(profile)}
                    {itemMeta(profile)}
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
    </Grid>
  )
}

export default ControlForm
