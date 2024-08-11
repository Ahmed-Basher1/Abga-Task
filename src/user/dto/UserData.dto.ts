import { Expose } from 'class-transformer';

export class UserData {
  @Expose()
  userName: string;

  @Expose()
  email: string;
  @Expose()
  role: string;
}
