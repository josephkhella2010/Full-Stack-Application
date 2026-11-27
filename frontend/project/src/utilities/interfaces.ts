export interface UserType {
  id: number;
  firebaseUid: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookType {
  id: number;
  title: string;
  author: string;
  description: string;
  imgs: string[];
  userId: null | string;
}
