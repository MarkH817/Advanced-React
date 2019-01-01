import React, { Component } from 'react'
import Router from 'next/router'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import formatMoney from '../lib/formatMoney'
import Form from './styles/Form'
import ErrorMessage from './ErrorMessage'

export const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`

export class CreateItem extends Component {
  state = {
    title: '',
    description: '',
    price: 0,
    image: '',
    largeImage: ''
  }

  handleChange = event => {
    const { name, type, value } = event.target
    const val = type === 'number' ? Number.parseFloat(value) : value

    this.setState({ [name]: val })
  }

  uploadFile = async event => {
    console.log('Uploading file...')

    const [filename] = event.target.files

    const data = new FormData()
    data.append('file', filename)
    data.append('upload_preset', 'sickfitsdemo')

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/lionbyte/image/upload',
      { method: 'post', body: data }
    )

    const file = await res.json()

    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    })
  }

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form
            onSubmit={async event => {
              // Stop default submission behavior
              event.preventDefault()

              // Call the mutation
              const { data } = await createItem()

              // Change to the single item page
              Router.push({
                pathname: '/item',
                query: { id: data.createItem.id }
              })
            }}
          >
            <h2>Sell an Item.</h2>

            <ErrorMessage error={error} />

            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor='file'>
                Image
                <input
                  type='file'
                  id='file'
                  name='file'
                  placeholder='Upload an Image'
                  onChange={this.uploadFile}
                  required
                />
                {this.state.image ? (
                  <img src={this.state.image} alt='Upload preview' />
                ) : null}
              </label>

              <label htmlFor='title'>
                Title
                <input
                  type='text'
                  id='title'
                  name='title'
                  placeholder='Title'
                  value={this.state.title}
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
                  value={this.state.price}
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
                  value={this.state.description}
                  onChange={this.handleChange}
                  required
                />
              </label>

              <button type='submit'>Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}

export default CreateItem
