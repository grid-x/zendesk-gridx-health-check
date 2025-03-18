import React from 'react'

import { SystemCheckResult, IndividualCheckResult, HealthCheckMetaData } from '../api/HealthCheck'
import { Accordion } from '@zendeskgarden/react-accordions'
import Check from './Check'

type HealthCheckInfo = Record<string, HealthCheckMetaData>

type CheckResultProps = SystemCheckResult & {
  key: string
  checkInfo: HealthCheckInfo
}
// System of checks for one system
const System = ({ system, results, checkInfo }: CheckResultProps) => (
  <>
    System UUID
    <br />
    <b>{system.id}</b>
    <Accordion level={4} isExpandable defaultExpandedSections={[]}>
      {results
        .filter((res) => res.type != 'connectionIssues') //FIXME: Include when we figure out how not to time out
        .map((res) => (
          <Check
            key={res.type}
            name={checkInfo[res.type]?.name || res.type}
            description={checkInfo[res.type]?.description}
            {...res}
          />
        ))}
    </Accordion>
  </>
)

export default System
