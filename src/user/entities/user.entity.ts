import { Todo } from 'src/todo/entities/todo.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'varchar', nullable: false, unique: true }) username: string;
  @Column({ type: 'varchar', nullable: false }) password: string;
  @Column({ type: 'varchar', nullable: false, unique: true }) email: string;
  @CreateDateColumn() createdOn?: Date;
  @CreateDateColumn() updatedOn?: Date;
  @Column()
  role: string;

  // one user can have multipe todos
  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
