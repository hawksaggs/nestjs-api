import { Column, Unique, Table, Model } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column({ unique: true })
  email: string;
  @Column
  password: string;
  @Column
  name: string;
}
