import React from 'react'
import {
  List,
  Datagrid,
  TextField,
  DateField,
  SelectInput,
  Edit,
  SimpleForm,
  TextInput,
  Show,
  SimpleShowLayout
} from 'react-admin'

export const BookingList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="type" />
      <TextField source="userId" />
      <DateField source="startAt" />
      <DateField source="endAt" />
      <TextField source="status" />
    </Datagrid>
  </List>
)

export const BookingEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="type" disabled />
      <TextInput source="userId" disabled />
      <SelectInput
        source="status"
        choices={[
          { id: 'PENDING', name: 'Pending' },
          { id: 'APPROVED', name: 'Approved' },
          { id: 'REJECTED', name: 'Rejected' },
          { id: 'CANCELLED', name: 'Cancelled' }
        ]}
      />
      <TextInput source="approvalNotes" multiline rows={4} />
    </SimpleForm>
  </Edit>
)
