import React, { Component } from 'react'
import Head from 'next/head'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'

import ErrorMessage from './ErrorMessage'

const SingleItemStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;

  img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }

  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`

export const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
      largeImage
    }
  }
`

export class SingleItem extends Component {
  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ data, loading, error }) => {
          if (loading) {
            return <p>Loading...</p>
          } else if (error) {
            return <ErrorMessage error={error} />
          }

          const { item } = data

          if (!item) {
            return <p>No item found for ID: ${this.props.id}</p>
          } else {
            return (
              <SingleItemStyles>
                <Head>
                  <title>Sick Fits | {item.title}</title>
                </Head>
                <img src={item.largeImage} alt={item.title} />

                <div className='details'>
                  <h2>Viewing {item.title}</h2>

                  <p>{item.description}</p>
                </div>
              </SingleItemStyles>
            )
          }
        }}
      </Query>
    )
  }
}

export default SingleItem
