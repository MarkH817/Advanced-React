import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import Form from './styles/Form'
import ErrorMessage from './ErrorMessage'
import { CURRENT_USER_QUERY } from './User'

export const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`

export class Signup extends Component {
  state = {
    email: '',
    name: '',
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
        mutation={SIGNUP_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signup, { error, loading }) => (
          <Form
            method='post'
            onSubmit={e => {
              e.preventDefault()
              signup()
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign Up for an Account!</h2>

              <ErrorMessage error={error} />

              <label htmlFor='name'>
                Name
                <input
                  id='name'
                  name='name'
                  placeholder='Name'
                  type='text'
                  required
                  value={this.state.name}
                  onChange={this.handleChange}
                />
              </label>

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

              <button type='submit'>Sign Up!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}

export default Signup
