import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'

import { perPage } from '../config'
import Item from './Item'
import Pagination from './Pagination'

const Center = styled.div`
  text-align: center;
`

const ItemList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`

export const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY($skip: Int = 0, $first: Int) {
    items(skip: $skip, first: $first, orderBy: createdAt_DESC) {
      id
      title
      price
      description
      image
      largeImage
    }
  }
`

export class Items extends Component {
  render() {
    const { page } = this.props

    return (
      <Center>
        <Pagination page={page} />

        <Query
          query={ALL_ITEMS_QUERY}
          variables={{ skip: (page - 1) * perPage, first: perPage }}
        >
          {({ data, error, loading }) => {
            if (loading) {
              return <p>Loading...</p>
            } else if (error) {
              return <p>Something went wrong. Error: {error.message}</p>
            } else {
              return (
                <ItemList>
                  {data.items.map(item => (
                    <Item key={item.id} item={item} />
                  ))}
                </ItemList>
              )
            }
          }}
        </Query>

        <Pagination page={page} />
      </Center>
    )
  }
}

export default Items
