import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import { ALL_ITEMS_QUERY } from './Items'

export const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`

export class DeleteItem extends Component {
  update = (cache, payload) => {
    // Manually update cache to synchronize with the server
    // 1. Read the cache for the items
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY })

    // 2. Filter deleted item from item list
    data.items = data.items.filter(
      item => item.id !== payload.data.deleteItem.id
    )

    // 3. Place the updated list back in the cache
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data })
  }

  render() {
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id: this.props.id }}
        update={this.update}
      >
        {(deleteItem, { error }) => (
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this item?')) {
                deleteItem().catch(err => {
                  alert(err.message)
                })
              }
            }}
          >
            {this.props.children}
          </button>
        )}
      </Mutation>
    )
  }
}

export default DeleteItem
