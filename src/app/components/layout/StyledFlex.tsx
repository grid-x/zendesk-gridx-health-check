import styled from 'styled-components'

export const StyledFlex = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: ${(props: any) => props.theme.space.md};
`