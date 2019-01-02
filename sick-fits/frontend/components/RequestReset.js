import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import Form from './styles/Form'
import ErrorMessage from './ErrorMessage'

export const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`

export class RequestReset extends Component {
  state = {
    email: ''
  }

  handleChange = event => {
    const {
      target: { name, value }
    } = event

    this.setState({ [name]: value })
  }

  render() {
    return (
      <Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state}>
        {(requestReset, { error, loading, called }) => (
          <Form
            method='post'
            onSubmit={e => {
              e.preventDefault()
              requestReset()
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset Your Password!</h2>

              <ErrorMessage error={error} />

              {!loading && !error && called && (
                <p>Success! Check your email for the reset link!</p>
              )}

              <label htmlFor='email'>
                Email
                <input
                  id='email'
                  name='email'
                  placeholder='Email'
                  type='email'
                  required
                  value={this.state.email}
                  onChange={this.handleChange}
                />
              </label>

              <button type='submit'>Request Reset!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}

export default RequestReset
