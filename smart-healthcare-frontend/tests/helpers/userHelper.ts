import type { APIRequestContext } from '@playwright/test';

import { API_PATHS } from '../config/app.config';
import {
  BASE_ADMIN,
  BASE_DOCTOR,
  BASE_PATIENT,
  DEFAULT_PASSWORD,
  EMAIL_DOMAIN,
  USERNAME_PREFIXES,
} from '../config/testData';
import type {
  AdminUser,
  DoctorUser,
  PatientUser,
} from '../types';
import {
  createUser,
  deleteUser,
  findUserId,
  openAdminSession,
} from './apiHelper';
import { makeCreatedId, withCreatedId } from './createdIdHelper';

type CreatedUser = {
  listPath: string;
  username: string;
};

const createdUsers: CreatedUser[] = [];

let adminSession: APIRequestContext | null = null;

async function getAdminSession(): Promise<APIRequestContext> {
  if (!adminSession) {
    adminSession = await openAdminSession();
  }

  return adminSession;
}

function uniqueUsername(prefix: string): string {
  return withCreatedId(prefix, makeCreatedId());
}

function emailFor(username: string): string {
  return `${username}@${EMAIL_DOMAIN}`;
}

async function registerUser<T extends { username: string }>(
  user: T,
  registerPath: string,
  listPath: string,
): Promise<T> {
  const api = await getAdminSession();

  createdUsers.push({ listPath, username: user.username });
  await createUser(api, registerPath, user);

  return user;
}

export function buildAdmin(overrides: Partial<AdminUser> = {}): AdminUser {
  const username = uniqueUsername(USERNAME_PREFIXES.ADMIN);

  return {
    ...BASE_ADMIN,
    username,
    email: emailFor(username),
    password: DEFAULT_PASSWORD,
    ...overrides,
  };
}

export function buildDoctor(overrides: Partial<DoctorUser> = {}): DoctorUser {
  const username = uniqueUsername(USERNAME_PREFIXES.DOCTOR);

  return {
    ...BASE_DOCTOR,
    username,
    email: emailFor(username),
    password: DEFAULT_PASSWORD,
    ...overrides,
  };
}

export function buildPatient(overrides: Partial<PatientUser> = {}): PatientUser {
  const username = uniqueUsername(USERNAME_PREFIXES.PATIENT);

  return {
    ...BASE_PATIENT,
    username,
    email: emailFor(username),
    password: DEFAULT_PASSWORD,
    ...overrides,
  };
}

export function createAdmin(overrides: Partial<AdminUser> = {}): Promise<AdminUser> {
  return registerUser(buildAdmin(overrides), API_PATHS.REGISTER_ADMIN, API_PATHS.ADMINS);
}

export function createDoctor(overrides: Partial<DoctorUser> = {}): Promise<DoctorUser> {
  return registerUser(buildDoctor(overrides), API_PATHS.REGISTER_DOCTOR, API_PATHS.DOCTORS);
}

export function createPatient(overrides: Partial<PatientUser> = {}): Promise<PatientUser> {
  return registerUser(buildPatient(overrides), API_PATHS.REGISTER_PATIENT, API_PATHS.PATIENTS);
}

export async function deleteCreatedUsers(): Promise<void> {
  if (!adminSession) {
    return;
  }

  const api = adminSession;
  const users = createdUsers.splice(0).reverse();
  const failures: string[] = [];

  for (const user of users) {
    try {
      const id = await findUserId(api, user.listPath, user.username);
      await deleteUser(api, user.listPath, id);
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error));
    }
  }

  await api.dispose();
  adminSession = null;

  if (failures.length > 0) {
    throw new Error(`Cleanup could not remove every user:\n${failures.join('\n')}`);
  }
}
