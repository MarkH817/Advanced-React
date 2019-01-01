import React from 'react'

import Items from '../components/Items'

const Home = props => {
  return (
    <div>
      <Items page={Number.parseInt(props.query.page) || 1} />
    </div>
  )
}

export default Home
