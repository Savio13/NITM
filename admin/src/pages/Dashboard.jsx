import React from 'react'
import { Card, CardContent, CardHeader, Grid, Typography, Box } from '@mui/material'
import { useGetList } from 'react-admin'

export default function Dashboard() {
  const { data: bookings, isLoading: bookingsLoading } = useGetList('bookings', {
    pagination: { page: 1, perPage: 5 },
    filter: { status: 'PENDING' }
  })
  const { data: users, isLoading: usersLoading } = useGetList('users', {
    pagination: { page: 1, perPage: 5 }
  })

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to NITM Admin Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader title="Pending Approvals" />
            <CardContent>
              <Typography variant="h5">
                {bookingsLoading ? '...' : bookings?.length || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Bookings awaiting approval
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader title="Total Users" />
            <CardContent>
              <Typography variant="h5">
                {usersLoading ? '...' : users?.length || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Active users in system
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
