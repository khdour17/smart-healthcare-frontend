import type { SvgIconComponent } from '@mui/icons-material';
import AdminPanelSettingsIcon
  from '@mui/icons-material/AdminPanelSettingsOutlined';
import DashboardIcon from '@mui/icons-material/DashboardOutlined';
import DescriptionIcon from '@mui/icons-material/DescriptionOutlined';
import EventIcon from '@mui/icons-material/EventOutlined';
import LocalHospitalIcon from '@mui/icons-material/LocalHospitalOutlined';
import MedicationIcon from '@mui/icons-material/MedicationOutlined';
import PeopleIcon from '@mui/icons-material/PeopleOutlined';
import PersonIcon from '@mui/icons-material/PersonOutlined';
import ScheduleIcon from '@mui/icons-material/ScheduleOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';

import type { UserRole } from '../../../../contexts/AuthContext';

export interface LeftMenuItem { key: string; label: string; path: string; icon: SvgIconComponent; }

const dashboard: LeftMenuItem = { key: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: DashboardIcon };
const appointments: LeftMenuItem = { key: 'appointments', label: 'Appointments', path: '/dashboard/appointments', icon: EventIcon };
const doctors: LeftMenuItem = { key: 'doctors', label: 'Doctors', path: '/dashboard/doctors', icon: LocalHospitalIcon };
const patients: LeftMenuItem = { key: 'patients', label: 'Patients', path: '/dashboard/patients', icon: PeopleIcon };
const medicalRecords: LeftMenuItem = { key: 'medicalRecords', label: 'Medical Records', path: '/dashboard/medical-records', icon: DescriptionIcon };
const prescriptions: LeftMenuItem = { key: 'prescriptions', label: 'Prescriptions', path: '/dashboard/prescriptions', icon: MedicationIcon };
const profile: LeftMenuItem = { key: 'profile', label: 'Profile', path: '/dashboard/profile', icon: PersonIcon };
const settings: LeftMenuItem = { key: 'settings', label: 'Settings', path: '/dashboard/settings', icon: SettingsIcon };
const admins: LeftMenuItem = { key: 'admins', label: 'Admins', path: '/dashboard/admins', icon: AdminPanelSettingsIcon };
const workHours: LeftMenuItem = { key: 'workHours', label: 'Work Hours', path: '/dashboard/availability', icon: ScheduleIcon };
const schedule: LeftMenuItem = { key: 'schedule', label: 'Appointments', path: '/dashboard/schedule', icon: EventIcon };

const itemsByRole: Record<UserRole, LeftMenuItem[]> = {
  ADMIN: [doctors, patients, admins, settings],
  DOCTOR: [schedule, workHours, medicalRecords, prescriptions, profile, settings],
  PATIENT: [appointments, medicalRecords, prescriptions, profile, settings],
};

export function getLeftMenuItems(role: UserRole): LeftMenuItem[] {
  return [dashboard, ...itemsByRole[role]];
}