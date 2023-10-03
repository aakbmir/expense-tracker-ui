import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '../providers/app-config.service';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  baseUrl: any;

  constructor(private http: HttpClient, private config: AppConfigService) {
    this.baseUrl = this.config.getConfig().bffServiceUrl + '/api/v1/budget';
  }

  getCurrentBudget(month: any, year: any): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('month', month).append('year', year);
    return this.http.get(`${this.baseUrl}/get-current-budget`, {
      params: queryParams,
    });
  }

  get(budgetName: any) {
    return this.http.get(`${this.baseUrl}/${budgetName}`);
  }

  updateBudget(form: any) {
    return this.http.post(`${this.baseUrl}/update-budget`, form);
  }

  addAllBudgets() {
    return this.http.get(`${this.baseUrl}/add-all-budgets`);
  }
}
