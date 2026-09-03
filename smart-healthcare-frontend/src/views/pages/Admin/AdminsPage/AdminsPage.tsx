import {
  type AdminResponse,
  deleteAdmins,
  getAllAdmins,
} from '../../../../api/admin/AdminAPI';
import type { DataTableColumn } from '../../../../components/DataTable/DataTable';
import { UserListPage } from '../../../shared/UserListPage/UserListPage';
import { AddAdminForm } from './AddAdminForm/AddAdminForm';

const columns: DataTableColumn<AdminResponse>[] = [
  { key: 'name', label: 'Name', width: 220, render: (row) => row.name },
  { key: 'department', label: 'Department', width: 180, render: (row) => row.department },
  { key: 'username', label: 'Username', width: 160, render: (row) => row.username },
  { key: 'email', label: 'Email', width: 240, render: (row) => row.email },
];

export default function AdminsPage() {
  return (
    <UserListPage
      title="Admins"
      subtitle="The people who can manage the system."
      one="Admin"
      many="admins"
      columns={columns}
      loadAll={getAllAdmins}
      deleteMany={deleteAdmins}
      renderAddForm={({ onSuccess, onCancel }) => <AddAdminForm onSuccess={onSuccess} onCancel={onCancel} />}
    />
  );
}
