import React from 'react'
import { Row, Col } from '@zendeskgarden/react-grid'
import { Tag } from '@zendeskgarden/react-tags'
import { Tooltip, Title, Paragraph } from '@zendeskgarden/react-tooltips'

import { StyledGrid } from './StyledGrid'
import { SystemCheckResult, IndividualCheckResult, CheckType, HealthCheckMetaData } from '../HealthCheckAPI'
import { useI18n } from './hooks/useI18n'
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
    System UUID<br/>
    <b>{system.id}</b>
    <Accordion level={4}>
      {results.map((res) => (
        <CheckResultItem
          key={res.type}
          name={checkInfo[res.type].name}
          description={checkInfo[res.type].description}
          {...res}
        />
      ))}
    </Accordion>
  </>
)

// Individual Check
const CheckResultItem = ({
  type,
  success,
  name,
  description,
  properties
}: IndividualCheckResult & HealthCheckMetaData & {key: string}) => {
  const { t } = useI18n()

  return (
    <Accordion.Section>
      <Accordion.Header>
        <ResultChip success={success} />
        <Accordion.Label>{name}</Accordion.Label>
      </Accordion.Header>
      <Accordion.Panel>
        {description}
        <dl>
          {Object.entries(properties).map((k, v) => (
            <>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </>
          ))}
        </dl>
      </Accordion.Panel>
    </Accordion.Section>
  )
}

const ResultChip = ({ success }) => (
  <Tag hue={success ? 'successHue' : 'dangerHue'} style={{ width: '4em', minWidth: '4em' }}>
    <span>{success ? 'pass' : 'fail'}</span>
  </Tag>
)

export default CheckResults
