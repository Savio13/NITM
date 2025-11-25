import React from 'react'
import { createRoot } from 'react-dom/client'
import { Admin, Resource } from 'react-admin'
import simpleRestProvider from 'ra-data-simple-rest'

const dataProvider = simpleRestProvider('/api')

function App() {
  return (
    <Admin dataProvider={dataProvider}>
      {/* Resources to be added: users, notices, bookings, vehicles */}
    </Admin>
  )
}

createRoot(document.getElementById('root')).render(<App />)
