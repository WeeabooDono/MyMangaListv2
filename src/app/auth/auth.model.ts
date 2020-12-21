import { User } from '../admin/users/user.model';

export interface Auth {
  user: User;
  token: string;
}
