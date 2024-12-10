import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css']
})
export class AddTransactionComponent implements OnInit {
  @Output() onAdd = new EventEmitter<void>();

  type = '';
  category = '';
  amount: number | null = null;
  date = new Date().toISOString().substring(0, 10);
  selectedCategory: string = '';
  newCategory: string = '';
  categories: string[] = [];

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    // Load transactions from localStorage
    const storedTransactions = localStorage.getItem('transactions');
    const transactions: { category: string }[] = storedTransactions ? JSON.parse(storedTransactions) : [];
  
    // Extract unique categories from the transactions
    this.categories = [...new Set(transactions.map((txn) => txn.category))];
  }

  addTransaction(): void {

    this.category = this.selectedCategory || this.newCategory;

    if (this.amount && this.category && this.type) {
     const transaction = this.transactionService.addTransaction({
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

  isCategoryTextboxDisabled(): boolean {
    return !!this.selectedCategory;
  }

  isCategoryDropdownDisabled(): boolean {
    return !!this.newCategory.trim();
  }
}
