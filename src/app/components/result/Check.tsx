import React from 'react'
import { Table } from '@zendeskgarden/react-tables'

import { IndividualCheckResult, HealthCheckMetaData } from  '../api/HealthCheck'
import { Accordion } from '@zendeskgarden/react-accordions'
import StateIcon from './StateIcon'


// Individual Check
const Check = ({
  type,
  state,
  name,
  description,
  properties
}: IndividualCheckResult & HealthCheckMetaData & { key: string }) => {
  return (
    <Accordion.Section key={`check-result-${type}`}>
      <Accordion.Header>
        <StateIcon state={state} />
        <Accordion.Label>{name}</Accordion.Label>
      </Accordion.Header>
      <Accordion.Panel>
        {description}
        {Object.keys(properties)?.length ? (
          <Table size="small">
            {Object.entries(properties).map(([k, v]) => (
              <Table.Row>
                <Table.Cell>{k}</Table.Cell>
                <Table.Cell>{v}</Table.Cell>
              </Table.Row>
            ))}
          </Table>
        ) : (
          <></>
        )}
      </Accordion.Panel>
    </Accordion.Section>
  )
}

export default Check
