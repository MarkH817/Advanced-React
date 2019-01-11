import React from 'react'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import Table from './styles/Table'
import SickButton from './styles/SickButton'
import ErrorMessage from './ErrorMessage'

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE'
]

export const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS_MUTATION(
    $permissions: [Permission!]!
    $userId: ID!
  ) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      name
      email
      permissions
    }
  }
`

export const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY {
    users {
      id
      name
      email
      permissions
    }
  }
`

const Permissions = props => (
  <Query query={ALL_USERS_QUERY}>
    {({ loading, error, data }) => (
      <div>
        <ErrorMessage error={error} />

        <div>
          <h2>Manage User Permissions</h2>

          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {possiblePermissions.map(permission => (
                  <th key={permission}>{permission}</th>
                ))}
                <th>👇🏽</th>
              </tr>
            </thead>

            <tbody>
              {data.users.map(user => (
                <UserPermissions key={user.id} user={user} />
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    )}
  </Query>
)

class UserPermissions extends React.Component {
  state = { permissions: [...this.props.user.permissions] }

  handlePermissionChange = event => {
    const { value, checked } = event.target

    this.setState(currentState => {
      let updatedPermissions = [...currentState.permissions]

      if (checked) {
        // Add the permission
        updatedPermissions.push(value)
      } else {
        // Remove the permission
        updatedPermissions = updatedPermissions.filter(
          permission => permission !== value
        )
      }

      return { permissions: updatedPermissions }
    })
  }

  render() {
    const { user } = this.props

    return (
      <Mutation
        mutation={UPDATE_PERMISSIONS_MUTATION}
        variables={{
          permissions: this.state.permissions,
          userId: user.id
        }}
      >
        {(updatePermissions, { loading, error }) => (
          <React.Fragment>
            {error && (
              <tr>
                <td colSpan={3 + possiblePermissions.length}>
                  <ErrorMessage error={error} />
                </td>
              </tr>
            )}
            <tr>
              <td>{user.name}</td>
              <td>{user.email}</td>

              {possiblePermissions.map(permission => {
                const inputId = `${user.id}-permission-${permission}`

                const isChecked = this.state.permissions.includes(permission)

                return (
                  <td key={permission}>
                    <label htmlFor={inputId}>
                      <input
                        id={inputId}
                        type='checkbox'
                        value={permission}
                        checked={isChecked}
                        onChange={this.handlePermissionChange}
                      />
                    </label>
                  </td>
                )
              })}

              <td>
                <SickButton
                  type='button'
                  disabled={loading}
                  onClick={updatePermissions}
                >
                  Updat{loading ? 'ing' : 'e'}
                </SickButton>
              </td>
            </tr>
          </React.Fragment>
        )}
      </Mutation>
    )
  }
}

export default Permissions
