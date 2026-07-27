import type { SvgIconComponent } from '@mui/icons-material';
import DashboardIcon from '@mui/icons-material/DashboardOutlined';
import DescriptionIcon from '@mui/icons-material/DescriptionOutlined';
import EventIcon from '@mui/icons-material/EventOutlined';
import LocalHospitalIcon from '@mui/icons-material/LocalHospitalOutlined';
import MedicationIcon from '@mui/icons-material/MedicationOutlined';
import PeopleIcon from '@mui/icons-material/PeopleOutlined';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAltOutlined';
import PersonIcon from '@mui/icons-material/PersonOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';

import type { UserRole } from '../contexts/AuthContext';

export interface SidebarItem {
  key: string;
  label: string;
  path: string;
  icon: SvgIconComponent;
}

const dashboard: SidebarItem = { key: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: DashboardIcon };
const appointments: SidebarItem = { key: 'appointments', label: 'Appointments', path: '/dashboard/appointments', icon: EventIcon };
const doctors: SidebarItem = { key: 'doctors', label: 'Doctors', path: '/dashboard/doctors', icon: LocalHospitalIcon };
const patients: SidebarItem = { key: 'patients', label: 'Patients', path: '/dashboard/patients', icon: PeopleIcon };
const medicalRecords: SidebarItem = { key: 'medicalRecords', label: 'Medical Records', path: '/dashboard/medical-records', icon: DescriptionIcon };
const prescriptions: SidebarItem = { key: 'prescriptions', label: 'Prescriptions', path: '/dashboard/prescriptions', icon: MedicationIcon };
const profile: SidebarItem = { key: 'profile', label: 'Profile', path: '/dashboard/profile', icon: PersonIcon };
const settings: SidebarItem = { key: 'settings', label: 'Settings', path: '/dashboard/settings', icon: SettingsIcon };
const createUser: SidebarItem = { key: 'createUser', label: 'Create User', path: '/dashboard/create-user', icon: PersonAddAltIcon };

const itemsByRole: Record<UserRole, SidebarItem[]> = {
  // Admin cannot GET /api/prescriptions or /api/medical-records — backend
  // restricts both to DOCTOR + PATIENT only (see SecurityConfig).
  ADMIN: [appointments, doctors, patients, createUser, settings],
  DOCTOR: [appointments, patients, medicalRecords, prescriptions, profile, settings],
  PATIENT: [appointments, medicalRecords, prescriptions, profile, settings],
};

export function getSidebarItems(role: UserRole): SidebarItem[] {
  return [dashboard, ...itemsByRole[role]];
}