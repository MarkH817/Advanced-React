import React from 'react'

import CreateItem from '../components/CreateItem'
import PleaseSignIn from '../components/PleaseSignIn'

const Home = props => {
  return (
    <div>
      <PleaseSignIn>
        <CreateItem />
      </PleaseSignIn>
    </div>
  )
}

export default Home
