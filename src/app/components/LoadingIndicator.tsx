
import { Grid } from '@zendeskgarden/react-grid';
import { MD, XXL } from '@zendeskgarden/react-typography';
import { Skeleton } from '@zendeskgarden/react-loaders';

const LoadingIndicator = () => (
  <Grid.Row justifyContent="center">
    <Grid.Col sm={5}>
      <XXL>
        <Skeleton />
      </XXL>
      <MD>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </MD>
    </Grid.Col>
  </Grid.Row>
);

export default LoadingIndicator;
