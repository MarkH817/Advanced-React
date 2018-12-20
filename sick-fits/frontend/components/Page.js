import React from 'react'
import styled from 'styled-components'

import Header from './Header'
import Meta from './Meta'
import Theme from './Theme'

const StyledPage = styled.div`
  background: white;
  color: ${props => props.theme.black};
`

const Inner = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
`

const Page = props => {
  const { children } = props

  return (
    <Theme>
      <StyledPage>
        <Meta />
        <Header />

        <Inner>{children}</Inner>
      </StyledPage>
    </Theme>
  )
}

export default Page
