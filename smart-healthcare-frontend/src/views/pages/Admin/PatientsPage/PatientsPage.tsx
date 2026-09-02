import {
  deletePatients,
  getAllPatients,
  type PatientResponse,
} from '../../../../api/patients/PatientsAPI';
import type { DataTableColumn } from '../../../../components/DataTable/DataTable';
import { UserListPage } from '../../../shared/UserListPage/UserListPage';
import { AddPatientForm } from './AddPatientForm/AddPatientForm';

const columns: DataTableColumn<PatientResponse>[] = [
  { key: 'name', label: 'Name', width: 220, render: (row) => row.name },
  { key: 'dateOfBirth', label: 'Date of Birth', width: 140, render: (row) => row.dateOfBirth },
  { key: 'phone', label: 'Phone', width: 140, render: (row) => row.phone },
  { key: 'username', label: 'Username', width: 160, render: (row) => row.username },
  { key: 'email', label: 'Email', width: 240, render: (row) => row.email },
];

export default function PatientsPage() {
  return (
    <UserListPage
      title="Patients"
      subtitle="Everyone registered in the system."
      one="Patient"
      many="patients"
      columns={columns}
      loadAll={getAllPatients}
      deleteMany={deletePatients}
      renderAddForm={({ onSuccess, onCancel }) => <AddPatientForm onSuccess={onSuccess} onCancel={onCancel} />}
    />
  );
}
