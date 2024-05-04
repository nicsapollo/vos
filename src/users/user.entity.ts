import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'user_type', nullable: true })
  userType: string;

  @Column({ name: 'user_account_id' })
  userAccountId: number;

  @Column({ name: 'date_created', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;

  @Column({ name: 'date_last_updated', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateLastUpdated: Date;

  @Column({ nullable: false, default: true })
  status: boolean;
}
