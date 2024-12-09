import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction.model';
import { AddTransactionComponent } from "../add-transaction/add-transaction.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, AddTransactionComponent]
})
export class DashboardComponent implements OnInit {
  transactions: Transaction[] = [];
  sortedTransactions: any[] = [];
  totalIncome = 0;
  totalExpense = 0;
  balance = 0;

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.transactions = this.transactionService.getTransactions();
    this.sortTransactionsByDate();
    this.calculateTotals();
  }

  calculateTotals(): void {
    this.totalIncome = this.transactions
      .filter(txn => txn.type === 'Income')
      .reduce((sum, txn) => sum + txn.amount, 0);

    this.totalExpense = this.transactions
      .filter(txn => txn.type === 'Expense')
      .reduce((sum, txn) => sum + txn.amount, 0);

    this.balance = this.totalIncome - this.totalExpense;
  }

   // Method to sort transactions by date in ASC order
   sortTransactionsByDate(): void {
    this.sortedTransactions = this.transactions.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB; // Sort in ASC order
    });
  }
  

  deleteTransaction(id: number): void {
    this.transactionService.deleteTransaction(id);
    this.transactions = this.transactionService.getTransactions(); // Refresh the list
    this.calculateTotals(); // Recalculate totals
  }

  clearAll():void{
    localStorage.clear()
    window.location.reload();
  }
}
