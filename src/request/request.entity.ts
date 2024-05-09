import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Request {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'request_type', nullable: false })
  requestType: string;

  @Column({ name: 'description', default:"" })
  description: string;

  @Column({ name: 'hours', default: 0 })
  hours: number;

  @Column({ name: 'status', default: "PENDING" })
  status: string;

  @Column({ name: 'date_created', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;

  @Column({ name: 'date_last_updated', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateLastUpdated: Date;

  // @Column({ nullable: false, default: true })
  // image: boolean;
}
