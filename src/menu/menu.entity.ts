import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'rating', type: 'decimal', precision: 3, scale: 1, default: 0 }) // Adjust precision and scale as needed
  rating: number;

  @Column({ name: 'description', default: "" })
  description: string;

  @Column({ name: 'price', type: 'decimal', precision: 6, scale: 2, default: 0 }) // Adjust precision and scale as needed
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
