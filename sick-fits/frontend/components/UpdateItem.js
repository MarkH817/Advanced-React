import React, { Component } from 'react'
import Router from 'next/router'
import { Mutation, Query } from 'react-apollo'
import gql from 'graphql-tag'

import formatMoney from '../lib/formatMoney'
import Form from './styles/Form'
import ErrorMessage from './ErrorMessage'

export const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`

export const UPDATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`

export class UpdateItem extends Component {
  state = {}

  handleChange = event => {
    const { name, type, value } = event.target
    const val = type === 'number' ? Number.parseFloat(value) : value

    this.setState({ [name]: val })
  }

  updateItem = async (event, updateItemMutation) => {
    event.preventDefault()

    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state
      }
    })

    Router.push({ pathname: '/item', query: { id: res.data.updateItem.id } })
  }

  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ data, loading }) => {
          if (loading) {
            return <p>Loading...</p>
          } else if (!data.item) {
            return <p>No Item Found For ID: {this.props.id}</p>
          } else {
            return (
              <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
                {(updateItem, { loading, error }) => (
                  <Form onSubmit={event => this.updateItem(event, updateItem)}>
                    <h2>Update an Item.</h2>

                    <ErrorMessage error={error} />

                    <fieldset disabled={loading} aria-busy={loading}>
                      <label htmlFor='title'>
                        Title
                        <input
                          type='text'
                          id='title'
                          name='title'
                          placeholder='Title'
                          defaultValue={data.item.title}
                          onChange={this.handleChange}
                          required
                        />
                      </label>

                      <label htmlFor='price'>
                        Price
                        <input
                          type='number'
                          id='price'
                          name='price'
                          placeholder='Price'
                          defaultValue={data.item.price}
                          onChange={this.handleChange}
                          required
                        />
                      </label>

                      <label htmlFor='description'>
                        Description
                        <textarea
                          id='description'
                          name='description'
                          placeholder='Enter a Description'
                          defaultValue={data.item.description}
                          onChange={this.handleChange}
                          required
                        />
                      </label>

                      <button type='submit'>
                        Sav{loading ? 'ing' : 'e'} Changes
                      </button>
                    </fieldset>
                  </Form>
                )}
              </Mutation>
            )
          }
        }}
      </Query>
    )
  }
}

export default UpdateItem
