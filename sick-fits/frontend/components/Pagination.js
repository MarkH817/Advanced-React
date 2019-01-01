import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

import { perPage } from '../config'
import PaginationStyles from './styles/PaginationStyles'

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`

/**
 * @param {object} props
 * @param {number} props.page
 */
const Pagination = props => (
  <Query query={PAGINATION_QUERY}>
    {({ loading, error, data }) => {
      if (loading || error) {
        return null
      }

      const { page } = props
      const {
        itemsConnection: {
          aggregate: { count }
        }
      } = data
      const pages = Math.ceil(count / perPage)

      return (
        <PaginationStyles>
          <Head>
            <title>
              Sick Fits! – Page {page} of {pages}
            </title>
          </Head>

          <Link
            prefetch
            href={{
              pathname: '/items',
              query: { page: page - 1 }
            }}
          >
            <a className='prev' aria-disabled={page <= 1}>
              &larr; Prev
            </a>
          </Link>

          <p>
            Page {page} of {pages}
          </p>

          <p>{count} Items Total</p>

          <Link
            prefetch
            href={{
              pathname: '/items',
              query: { page: page + 1 }
            }}
          >
            <a className='next' aria-disabled={page >= pages}>
              Next &rarr;
            </a>
          </Link>
        </PaginationStyles>
      )
    }}
  </Query>
)

export default Pagination
