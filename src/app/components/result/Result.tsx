import React from 'react'
import { Grid } from '@zendeskgarden/react-grid'

import { StyledGrid } from '../StyledGrid'
import { SystemCheckResult, HealthCheckMetaData } from  '../api/HealthCheck'
import System from './System'

type HealthCheckInfo = Record<string, HealthCheckMetaData>

type ResultProps = {
  result: SystemCheckResult[]
  checkInfo: HealthCheckInfo
}

// List of systems with checks
const Result = ({ result, checkInfo }: ResultProps) => {
  return (
    <StyledGrid>
      <Grid.Row>
        <Grid.Col>
          {result.map((res) => (
            <System key={res.system.id} checkInfo={checkInfo} {...res} />
          ))}
        </Grid.Col>
      </Grid.Row>
    </StyledGrid>
  )
}

export default Result