export interface User {
  id: string;
  name: string;
  surname : string;
  email: string;
  password : string;
  image?: string;
  token? : string;
  validated : boolean;
  locked : boolean;
  role : UserRole;
}

export type UserRole =  "admin" | "user"