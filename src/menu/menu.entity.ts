import { TransactionItem } from 'src/transaction-items/transaction-item.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;
  
  // @OneToOne(() => TransactionItem, transactionItem => transactionItem.menu)
  // transactionItem: TransactionItem;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'rating', type: 'decimal', precision: 3, scale: 1, default: 0 }) // Adjust precision and scale as needed
  rating: number;

  @Column({ name: 'image', nullable: true })
  image: string; // Store the image as a buffer

  @Column({ name: 'price', type: 'decimal', precision: 6, scale: 2, default: 0 }) // Adjust precision and scale as needed
  price: number;

  @Column({ name: 'status', default: true })
  status: boolean;

  @Column({ name: 'date_created', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;

  @Column({ name: 'date_last_updated', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateLastUpdated: Date;
}
