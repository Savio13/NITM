import React from 'react'
import { createRoot } from 'react-dom/client'
import { Admin, Resource } from 'react-admin'
import simpleRestProvider from 'ra-data-simple-rest'
import { UserList, UserEdit, UserCreate } from './resources/users'
import { BookingList, BookingEdit } from './resources/bookings'
import { ApprovalList, ApprovalEdit } from './resources/approvals'
import Dashboard from './pages/Dashboard'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const authProvider = {
  login: async ({ username, password }) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: username, password })
    })
    if (response.status < 200 || response.status >= 300) throw new Error('Invalid login')
    const { accessToken, user } = await response.json()
    localStorage.setItem('token', accessToken)
    localStorage.setItem('user', JSON.stringify(user))
    return Promise.resolve()
  },
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return Promise.resolve()
  },
  checkAuth: () => localStorage.getItem('token') ? Promise.resolve() : Promise.reject(),
  checkError: (status) => {
    if (status === 401 || status === 403) return Promise.reject()
    return Promise.resolve()
  },
  getPermissions: () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return Promise.resolve(user.role)
  }
}

const dataProvider = simpleRestProvider(API_URL)

createRoot(document.getElementById('root')).render(
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    dashboard={Dashboard}
    title="NITM Admin"
  >
    <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} />
    <Resource name="bookings" list={BookingList} edit={BookingEdit} />
    <Resource name="approvals" list={ApprovalList} edit={ApprovalEdit} />
  </Admin>
)
