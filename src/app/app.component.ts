import { Component } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { Router } from '@angular/router';
import {
  faFileAlt, faChartPie, faChartLine, faLayerGroup, faReceipt,
  faPiggyBank, faMoneyBillWave, faTags, faMoon, faSun
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  faFileAlt = faFileAlt;
  faChartPie = faChartPie;
  faChartLine = faChartLine;
  faLayerGroup = faLayerGroup;
  faReceipt = faReceipt;
  faPiggyBank = faPiggyBank;
  faMoneyBillWave = faMoneyBillWave;
  faTags = faTags;
  faMoon = faMoon;
  faSun = faSun;
  title = 'Expense-Tracker-UI';
  constructor(
    public themeService: ThemeService,
    public router: Router
  ) { }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
