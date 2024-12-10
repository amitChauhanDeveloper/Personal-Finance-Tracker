import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction.model';
import { AddTransactionComponent } from "../add-transaction/add-transaction.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';  
import autoTable from 'jspdf-autotable'; 
import { format } from 'date-fns';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, AddTransactionComponent,FormsModule]
})
export class DashboardComponent implements OnInit {
  transactions: Transaction[] = [];
  sortedTransactions: any[] = [];
  totalIncome = 0;
  totalExpense = 0;
  balance = 0;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  searchText: string = '';

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

  // Pagination logic
  get paginatedTransactions(): Transaction[] {
    const filtered = this.transactions.filter(txn =>
      txn.category.toLowerCase().includes(this.searchText.toLowerCase()) ||
      txn.type.toLowerCase().includes(this.searchText.toLowerCase()) ||
      txn.date.includes(this.searchText)
    );

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = this.currentPage * this.itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }

  totalPages(): number {
    return Math.ceil(
      this.transactions.filter(txn =>
        txn.category.toLowerCase().includes(this.searchText.toLowerCase()) ||
        txn.type.toLowerCase().includes(this.searchText.toLowerCase()) ||
        txn.date.includes(this.searchText)
      ).length / this.itemsPerPage
    );
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  downloadPDF(): void {
    const doc = new jsPDF();

    // Arrow function to format date as 'dd/MM/yyyy'
    const formatDate = (date: string | Date) => format(new Date(date), 'dd-MM-yyyy');

    const tableData = this.transactions.map(txn => [
      formatDate(txn.date),
      txn.type,
      txn.category,
      txn.amount
    ]);
  
    // Use the autoTable plugin
    autoTable(doc, {
      head: [['Date', 'Type', 'Category', 'Amount']],  // Table headers
      body: tableData,  // Table data
    });
    
  
    // Save the PDF
    doc.save('transactions.pdf');
  }
  
  
}
