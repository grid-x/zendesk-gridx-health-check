import React from 'react'
import { Row, Col } from '@zendeskgarden/react-grid'
import { Tag } from '@zendeskgarden/react-tags'
import { Table, Row as TRow, Cell as TCell } from '@zendeskgarden/react-tables'

import { StyledGrid } from './StyledGrid'
import { SystemCheckResult, IndividualCheckResult, HealthCheckMetaData } from '../HealthCheckAPI'
import { Accordion } from '@zendeskgarden/react-accordions'

type HealthCheckInfo = Record<string, HealthCheckMetaData>

type CheckResultsProps = {
  result: SystemCheckResult[]
  checkInfo: HealthCheckInfo
}

// List of systems with checks
const CheckResults = ({ result, checkInfo }: CheckResultsProps) => {
  return (
    <StyledGrid>
      <Row>
        <Col>
          {result.map((res) => (
            <CheckResult key={res.system.id} checkInfo={checkInfo} {...res} />
          ))}
        </Col>
      </Row>
    </StyledGrid>
  )
}

type CheckResultProps = SystemCheckResult & {
  key: string
  checkInfo: HealthCheckInfo
}
// List of checks for one system
const CheckResult = ({ system, results, checkInfo }: CheckResultProps) => (
  <>
    System UUID
    <br />
    <b>{system.id}</b>
    <Accordion level={4} isExpandable defaultExpandedSections={[]}>
      {results
        .filter((res) => res.type != 'connectionIssues') //FIXME: Include when we figure out how not to time out
        .map((res) => (
          <CheckResultItem
            key={res.type}
            name={checkInfo[res.type]?.name || res.type}
            description={checkInfo[res.type]?.description}
            {...res}
          />
        ))}
    </Accordion>
  </>
)

// Individual Check
const CheckResultItem = ({
  type,
  state,
  name,
  description,
  properties
}: IndividualCheckResult & HealthCheckMetaData & { key: string }) => {
  return (
    <Accordion.Section key={`check-result-${type}`}>
      <Accordion.Header>
        <ResultChip state={state} />
        <Accordion.Label>{name}</Accordion.Label>
      </Accordion.Header>
      <Accordion.Panel>
        {description}
        {Object.keys(properties)?.length ? (
          <Table size="small">
            {Object.entries(properties).map(([k, v]) => (
              <TRow>
                <TCell>{k}</TCell>
                <TCell>{v}</TCell>
              </TRow>
            ))}
          </Table>
        ) : (
          <></>
        )}
      </Accordion.Panel>
    </Accordion.Section>
  )
}

const resultStates = {
  PASSED: { color: 'successHue', label: 'pass' },
  FAILED: { color: 'dangerHue', label: 'fail' },
  SKIPPED: { color: 'warningHue', label: 'skip' }
}

const ResultChip = ({ state }) => (
  <Tag hue={resultStates[state]?.color ?? 'primaryHue'} style={{ width: '4em', minWidth: '4em' }}>
    <span>{resultStates[state]?.label ?? 'n/a'}</span>
  </Tag>
)

export default CheckResults
