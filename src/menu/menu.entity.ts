import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'rating',  default: () => 0 })
  rating: number;

  @Column({ name: 'price', default: () => 0 })
  price: number;

  @Column({ name: 'status', default: true })
  status: boolean;

  @Column({ name: 'date_created', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;

  @Column({ name: 'date_last_updated', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateLastUpdated: Date;

  // @Column({ nullable: false, default: true })
  // image: boolean;
}
