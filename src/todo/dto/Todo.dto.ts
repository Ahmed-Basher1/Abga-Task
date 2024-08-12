import { Expose } from 'class-transformer';

export class TodoData {
  @Expose()
  title: string;

  @Expose()
  description: string;
  @Expose()
  status: string;
  @Expose()
  date: Date;
  @Expose({ name: 'user' })
  // user is object of UserData class i want to return only name of user
  user: any;
}
