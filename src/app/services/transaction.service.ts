import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  
  private transactions: Transaction[] = [];

  constructor() {
    // Check if the code is running in the browser before accessing localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTransactions = localStorage.getItem('transactions');
      this.transactions = storedTransactions ? JSON.parse(storedTransactions) : [];
    }
  }

  getTransactions(): Transaction[] {
    return this.transactions;
  }

  addTransaction(transaction: Transaction): void {
    transaction.id = new Date().getTime(); // Set a unique ID for the transaction
    this.transactions.push(transaction);
    this.updateLocalStorage();
  }

  deleteTransaction(id: number): void {
    this.transactions = this.transactions.filter(txn => txn.id !== id);
    this.updateLocalStorage();
  }

  private updateLocalStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('transactions', JSON.stringify(this.transactions));
    }
  }
}
