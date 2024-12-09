import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Chart, ArcElement, Tooltip, Legend, PieController } from 'chart.js';  // Import components
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements AfterViewInit {
  constructor(
    private transactionService: TransactionService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Register required components for pie chart
    Chart.register(PieController, ArcElement, Tooltip, Legend);  // Register components
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.generateChart();
    }
  }

  generateChart(): void {
    const transactions = this.transactionService.getTransactions();
    
    const expenseCategories = transactions
      .filter(txn => txn.type === 'Expense')
      .reduce((acc, txn) => {
        acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
        return acc;
      }, {} as { [key: string]: number });

    const ctx = document.getElementById('chart') as HTMLCanvasElement;

    if (ctx) {
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: Object.keys(expenseCategories),
          datasets: [
            {
              data: Object.values(expenseCategories),
              backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'],
            },
          ],
        },
      });
    } else {
      console.error("Canvas element not found.");
    }
  }
}
