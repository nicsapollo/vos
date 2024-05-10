import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TransactionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'transaction_id', nullable: false })
  transactionId: number;

  @Column({ name: 'request_id', nullable: false })
  requestId: number;

  @Column({ name: 'menu_id', nullable: false })
  menuId: number;

  @Column({ nullable: false, default: false })
  status: boolean;

  @Column({ name: 'quantity', nullable: false })
  quantity: number;

  @Column({ name: 'date_created', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;

  @Column({ name: 'date_last_updated', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateLastUpdated: Date;

}
