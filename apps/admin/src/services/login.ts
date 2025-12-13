import { request } from '@umijs/max';
import type { ILoginFormData } from '@/types';

export interface ILoginResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
    email: string;
    access: string;
  };
}

export async function loginApi(data: ILoginFormData): Promise<ILoginResponse> {
  return request('/api/auth/login', {
    method: 'POST',
    data,
  });
}
