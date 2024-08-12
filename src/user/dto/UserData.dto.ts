import { Expose } from 'class-transformer';

export class UserData {
  @Expose()
  username: string;

  @Expose()
  email: string;
  @Expose()
  role: string;
}
