import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import Form from './styles/Form'
import ErrorMessage from './ErrorMessage'
import { CURRENT_USER_QUERY } from './User'

export const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      name
      email
    }
  }
`

export class Reset extends Component {
  state = {
    password: '',
    confirmPassword: ''
  }

  handleChange = event => {
    const {
      target: { name, value }
    } = event

    this.setState({ [name]: value })
  }

  render() {
    return (
      <Mutation
        mutation={RESET_MUTATION}
        variables={{
          resetToken: this.props.resetToken,
          ...this.state
        }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(resetPassword, { error, loading, called }) => (
          <Form
            method='post'
            onSubmit={e => {
              e.preventDefault()
              resetPassword()
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Choose New Password</h2>

              <ErrorMessage error={error} />

              <label htmlFor='password'>
                Password
                <input
                  id='password'
                  name='password'
                  placeholder='Password'
                  type='password'
                  required
                  value={this.state.password}
                  onChange={this.handleChange}
                />
              </label>

              <label htmlFor='confirmPassword'>
                Confirm Your Password
                <input
                  id='confirmPassword'
                  name='confirmPassword'
                  placeholder='Confirm Password'
                  type='password'
                  required
                  value={this.state.confirmPassword}
                  onChange={this.handleChange}
                />
              </label>

              <button type='submit'>Reset Your Password</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}

export default Reset
