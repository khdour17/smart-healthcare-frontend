import {
  type APIRequestContext,
  type APIResponse,
  request,
} from '@playwright/test';

import { API_PATHS, API_URL } from '../config/app.config';
import { BOOTSTRAP_ADMIN } from '../config/testData';
import type { Credentials } from '../types';

async function failIfNotOk(response: APIResponse, path: string): Promise<void> {
  if (!response.ok()) {
    throw new Error(`${path} failed: ${response.status()} ${await response.text()}`);
  }
}

async function openSession(credentials: Credentials): Promise<APIRequestContext> {
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

export async function getJson<T>(api: APIRequestContext, path: string): Promise<T> {
  const response = await api.get(path);
  await failIfNotOk(response, path);

  return (await response.json()) as T;
}

export async function postJson(api: APIRequestContext, path: string, data: unknown): Promise<void> {
  const response = await api.post(path, { data });
  await failIfNotOk(response, path);
}

export async function deletePath(api: APIRequestContext, path: string): Promise<void> {
  const response = await api.delete(path);
  await failIfNotOk(response, path);
}
