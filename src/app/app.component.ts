import { Component } from '@angular/core';
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { ReportComponent } from "./components/report/report.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardComponent, ReportComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'personal-finance-tracker';
}
