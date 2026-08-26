import {
  type APIRequestContext,
  type APIResponse,
  request,
} from '@playwright/test';

import { API_PATHS, API_URL } from '../config/app.config';
import { BOOTSTRAP_ADMIN } from '../config/testData';
import type { Credentials } from '../types';

type ApiUser = {
  id: number;
  username: string;
};

async function failIfNotOk(response: APIResponse, path: string): Promise<void> {
  if (!response.ok()) {
    throw new Error(`${path} failed: ${response.status()} ${await response.text()}`);
  }
}

export async function openSession(credentials: Credentials): Promise<APIRequestContext> {
  const anonymous = await request.newContext({ baseURL: API_URL });
  let token: string;

  try {
    const response = await anonymous.post(API_PATHS.LOGIN, { data: credentials });
    await failIfNotOk(response, API_PATHS.LOGIN);

    const body = (await response.json()) as { token: string };
    token = body.token;
  } finally {
    await anonymous.dispose();
  }

  return request.newContext({
    baseURL: API_URL,
    extraHTTPHeaders: { Authorization: `Bearer ${token}` },
  });
}

export function openAdminSession(): Promise<APIRequestContext> {
  return openSession(BOOTSTRAP_ADMIN);
}

export async function createUser(api: APIRequestContext, registerPath: string, user: unknown): Promise<void> {
  const response = await api.post(registerPath, { data: user });
  await failIfNotOk(response, registerPath);
}

export async function findUserId(api: APIRequestContext, listPath: string, username: string): Promise<number> {
  const response = await api.get(listPath);
  await failIfNotOk(response, listPath);

  const users = (await response.json()) as ApiUser[];
  const match = users.find((user) => user.username === username);

  if (!match) {
    throw new Error(`No user named ${username} at ${listPath}`);
  }

  return match.id;
}

export async function deleteUser(api: APIRequestContext, listPath: string, id: number): Promise<void> {
  const path = `${listPath}/${id}`;
  const response = await api.delete(path);
  await failIfNotOk(response, path);
}
