import { UserData } from 'src/user/dto/UserData.dto';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
  @Column()
  description: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ enum: ['completed', 'pending'], default: 'pending' })
  status: string;

  //   many todos can belong to single user
  @ManyToOne(() => User, (user) => user.todos)
  user: UserData;
}
