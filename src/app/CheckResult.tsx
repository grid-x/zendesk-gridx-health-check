import React from 'react'
import { Row, Col } from '@zendeskgarden/react-grid'
import { Tag } from '@zendeskgarden/react-tags'
import { Tooltip, Title, Paragraph } from '@zendeskgarden/react-tooltips'

import { StyledGrid } from './StyledGrid'
import { SystemCheckResult, IndividualCheckResult, CheckType, HealthCheckMetaData } from '../HealthCheckAPI'
import { useI18n } from './hooks/useI18n'
import { Accordion } from '@zendeskgarden/react-accordions';


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
  checkInfo: HealthCheckInfo
}
// List of checks for one system
const CheckResult = ({ system, results, checkInfo }: CheckResultProps) => (
  <>
    <b>{system.id}</b>
    <table>
      <tbody>
        {results.map((res) => (
          <CheckResultItem
            key={res.type}
            name={checkInfo[res.type].name}
            description={checkInfo[res.type].description}
            {...res}
          />
        ))}
      </tbody>
    </table>
  </>
)

// Individual Check
const CheckResultItem = ({
  type,
  success,
  name,
  description,
  properties
}: IndividualCheckResult & HealthCheckMetaData) => {
  const { t } = useI18n()

  return (
    <tr>
      <td>
        <ResultChip success={success} />
      </td>
      <td>
        <Tooltip
          type="light"
          size="extra-large"
          placement="auto"
          content={
            <>
              <Title>{name}</Title>
              <Paragraph>{description}</Paragraph>
              <dl>
                {Object.entries(properties).map((k, v) => (
                  <>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </>
                ))}
              </dl>
            </>
          }
        >
          <span>{name}</span>
        </Tooltip>
      </td>
    </tr>
  )
}

const ResultChip = ({ success }) => (
  <Tag hue={success ? 'successHue' : 'dangerHue'} style={{ width: '4em' }}>
    <span>{success ? 'pass' : 'fail'}</span>
  </Tag>
)

export default CheckResults
