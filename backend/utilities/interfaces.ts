export interface NewUser {
  id?: number | string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password?: string;
}
