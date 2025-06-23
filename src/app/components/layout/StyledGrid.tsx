import { Grid } from '@zendeskgarden/react-grid'

import styled from 'styled-components'

export const StyledGrid = styled(Grid)`
  display: grid;
  gap: ${(props: any) => props.theme.space.md};
  > * {
    padding: 0;
  }
`