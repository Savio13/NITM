import React from 'react'
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  Edit,
  SimpleForm,
  TextInput,
  Create,
  PasswordInput,
  SelectInput
} from 'react-admin'

export const UserList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <EmailField source="email" />
      <TextField source="role" />
      <TextField source="status" />
    </Datagrid>
  </List>
)

export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="name" />
      <EmailField source="email" disabled />
      <SelectInput
        source="role"
        choices={[
          { id: 'STUDENT', name: 'Student' },
          { id: 'FACULTY', name: 'Faculty' },
          { id: 'CANTEEN', name: 'Canteen Staff' },
          { id: 'HOUSEKEEPING', name: 'Housekeeping' },
          { id: 'DRIVER', name: 'Driver' },
          { id: 'HOD', name: 'HOD' },
          { id: 'ADMIN', name: 'Admin' }
        ]}
      />
      <SelectInput
        source="status"
        choices={[
          { id: 'active', name: 'Active' },
          { id: 'suspended', name: 'Suspended' }
        ]}
      />
    </SimpleForm>
  </Edit>
)

export const UserCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" required />
      <TextInput source="email" type="email" required />
      <PasswordInput source="password" required />
      <SelectInput
        source="role"
        choices={[
          { id: 'STUDENT', name: 'Student' },
          { id: 'FACULTY', name: 'Faculty' },
          { id: 'CANTEEN', name: 'Canteen Staff' },
          { id: 'HOUSEKEEPING', name: 'Housekeeping' },
          { id: 'DRIVER', name: 'Driver' },
          { id: 'HOD', name: 'HOD' },
          { id: 'ADMIN', name: 'Admin' }
        ]}
        required
      />
    </SimpleForm>
  </Create>
)
