import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table
export class Post extends Model {
  @Column
  public title: string;

  @Column
  public content: string;
}
