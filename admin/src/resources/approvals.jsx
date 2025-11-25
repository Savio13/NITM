import React from 'react'
import {
  List,
  Datagrid,
  TextField,
  DateField,
  Edit,
  SimpleForm,
  TextInput,
  Button
} from 'react-admin'
import { useUpdate, useNotify } from 'react-admin'

export const ApprovalList = () => (
  <List filter={{ status: 'PENDING' }}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="type" />
      <TextField source="userId" />
      <DateField source="createdAt" />
      <TextField source="status" />
    </Datagrid>
  </List>
)

export const ApprovalEdit = () => {
  const [update] = useUpdate()
  const notify = useNotify()

  const handleApprove = async (record) => {
    try {
      await update('bookings', { id: record.id, data: { status: 'APPROVED' } })
      notify('Booking approved', { type: 'success' })
    } catch (e) {
      notify('Error approving booking', { type: 'error' })
    }
  }

  const handleReject = async (record) => {
    try {
      await update('bookings', { id: record.id, data: { status: 'REJECTED' } })
      notify('Booking rejected', { type: 'success' })
    } catch (e) {
      notify('Error rejecting booking', { type: 'error' })
    }
  }

  return (
    <Edit actions={false}>
      <SimpleForm>
        <TextInput source="id" disabled />
        <TextInput source="type" disabled />
        <TextInput source="userId" disabled />
        <TextInput source="approvalNotes" multiline rows={4} />
        <div style={{ marginTop: '1rem' }}>
          <Button
            label="Approve"
            onClick={(record) => handleApprove(record)}
            color="success"
          />
          <Button
            label="Reject"
            onClick={(record) => handleReject(record)}
            color="error"
            style={{ marginLeft: '0.5rem' }}
          />
        </div>
      </SimpleForm>
    </Edit>
  )
}
