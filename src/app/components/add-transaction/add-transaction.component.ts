import { Component, EventEmitter, Output } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css']
})
export class AddTransactionComponent {
  @Output() onAdd = new EventEmitter<void>();

  type: 'Income' | 'Expense' = 'Income';
  category = '';
  amount: number | null = null;
  date = new Date().toISOString().substring(0, 10);

  constructor(private transactionService: TransactionService) {}

  addTransaction(): void {
    if (this.amount && this.category) {
      this.transactionService.addTransaction({
        id: 0,
        type: this.type,
        category: this.category,
        amount: this.amount,
        date: this.date,
      });
      this.onAdd.emit();
      window.location.reload();
    }
  }
}
