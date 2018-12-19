import React from 'react'

import Header from './Header'
import Meta from './Meta'

const Page = props => {
  const { children } = props

  return (
    <div>
      <Meta />
      <Header />

      {children}
    </div>
  )
}

export default Page
