import { UserProfile } from './profile';

export type UserRole = 'client' | 'consultant' | 'admin';

export interface AuthUser {
  uid: string;
  email: string | null;
  role: UserRole;
  profile?: UserProfile;
}

export interface RegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}