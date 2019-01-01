import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import Form from './styles/Form'
import ErrorMessage from './ErrorMessage'
import { CURRENT_USER_QUERY } from './User'

export const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`

export class Signin extends Component {
  state = {
    email: '',
    password: ''
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
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signin, { error, loading }) => (
          <Form
            method='post'
            onSubmit={e => {
              e.preventDefault()
              signin()
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign Into Your Account!</h2>

              <ErrorMessage error={error} />

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

              <button type='submit'>Sign In!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}

export default Signin
