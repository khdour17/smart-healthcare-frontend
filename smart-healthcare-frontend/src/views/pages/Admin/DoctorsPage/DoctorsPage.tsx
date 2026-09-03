import {
  deleteDoctors,
  type DoctorResponse,
  getAllDoctors,
} from '../../../../api/doctors/DoctorsAPI';
import type { DataTableColumn } from '../../../../components/DataTable/DataTable';
import { UserListPage } from '../../../shared/UserListPage/UserListPage';
import { AddDoctorForm } from './AddDoctorForm/AddDoctorForm';

const columns: DataTableColumn<DoctorResponse>[] = [
  { key: 'name', label: 'Name', width: 220, render: (row) => row.name },
  { key: 'specialty', label: 'Specialty', width: 180, render: (row) => row.specialty },
  { key: 'username', label: 'Username', width: 160, render: (row) => row.username },
  { key: 'email', label: 'Email', width: 240, render: (row) => row.email },
];

export default function DoctorsPage() {
  return (
    <UserListPage
      title="Doctors"
      subtitle="Everyone who takes appointments."
      one="Doctor"
      many="doctors"
      columns={columns}
      loadAll={getAllDoctors}
      deleteMany={deleteDoctors}
      renderAddForm={({ onSuccess, onCancel }) => <AddDoctorForm onSuccess={onSuccess} onCancel={onCancel} />}
    />
  );
}
