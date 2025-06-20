import { Grid } from '@zendeskgarden/react-grid'
import { SystemCheckResult, HealthCheckInfo } from '../api/HealthCheck'
import System from './System'
import { StyledGrid } from '../layout/StyledGrid'


type ResultProps = {
  result: SystemCheckResult[]
  checkInfo: HealthCheckInfo
}

const Result = ({ result, checkInfo }: ResultProps) => {
  return (
    <StyledGrid style={{ overflow: 'scroll' }}>
      <Grid.Row>
        <Grid.Col>
          {result.map((res) => (
            <System
              key={res.system.id}
              checkInfo={checkInfo}
              {...res}
            />
          ))}
        </Grid.Col>
      </Grid.Row>
    </StyledGrid>
  )
}

export default Result