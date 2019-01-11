import React from 'react'

import Signin from './Signin'
import User from './User'

const PleaseSignIn = props => (
  <User>
    {({ data, loading }) => {
      if (loading) {
        return <p>Loading...</p>
      } else if (!data.me) {
        return (
          <div>
            <p>Please Sign In.</p>
            <Signin />
          </div>
        )
      }

      return props.children
    }}
  </User>
)

export default PleaseSignIn
