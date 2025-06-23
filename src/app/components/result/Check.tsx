import { Table } from '@zendeskgarden/react-tables'
import { IndividualCheckResult } from '../api/HealthCheck'
import { Accordion } from '@zendeskgarden/react-accordions'
import StateIcon from './StateIcon'
import { MD } from '@zendeskgarden/react-typography'


type CheckProps = {
  name: string
  description: string
} & IndividualCheckResult

const Check = ({
  type,
  state,
  name,
  description,
  properties
}: CheckProps) => {
  return (
    <Accordion.Section key={`check-result-${type}`}>
      <Accordion.Header>
        <StateIcon state={state} />
        <Accordion.Label>{name}</Accordion.Label>
      </Accordion.Header>
      <Accordion.Panel>
        <MD style={{ paddingBottom: '1em' }}>
          {description}
        </MD>
        {Object.keys(properties)?.length ? (
          <Table size="small">
            {Object.entries(properties).map(([k, v], i) => (
              <Table.Row
                key={`${{k}}-${{i}}`}
                isStriped={i % 2 === 0}
              >
                <Table.Cell style={{ overflowWrap: 'break-word'}}>{k}</Table.Cell>
                <Table.Cell>{v}</Table.Cell>
              </Table.Row>
            ))}
          </Table>
        ) : null}
      </Accordion.Panel>
    </Accordion.Section>
  )
}

export default Check
