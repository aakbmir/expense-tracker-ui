import { Component } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Expense-Tracker-UI';
  constructor(
    public themeService: ThemeService,
    public router: Router
  ) {}

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
