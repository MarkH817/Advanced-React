import React from 'react'

import UpdateItem from '../components/UpdateItem'

const Update = props => {
  const { query } = props

  return (
    <div>
      <UpdateItem id={query.id} />
    </div>
  )
}

export default Update
