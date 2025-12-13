export interface ILoginResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
    email: string;
    access: string;
  };
}