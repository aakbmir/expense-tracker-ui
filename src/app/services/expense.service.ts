import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '../providers/app-config.service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  baseUrl: any;

  constructor(private http: HttpClient, private config: AppConfigService) {
    this.baseUrl = this.config.getConfig().bffServiceUrl + '/api/v1/expense';
  }

  getCurrentExpense(month: any, year: any): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('month', month).append('year', year);
    return this.http.get(`${this.baseUrl}/get-current-expense`, {
      params: queryParams,
    });
  }

  getAllExpenses(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-all-expenses`);
  }

  get(name: any) {
    return this.http.get(`${this.baseUrl}/${name}`);
  }

  updateExpense(form: any) {
    return this.http.post(`${this.baseUrl}/update-expense`, form);
  }

  filterExpense(month: any, year: any) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('month', month).append('year', year);
    return this.http.get(`${this.baseUrl}/filter-expense`, {
      params: queryParams,
    });
  }

  fetchParentExpense() {
    return this.http.get(`${this.baseUrl}/fetch-parent-expense`);
  }

  saveExpense(data: any) {
    return this.http.post(`${this.baseUrl}/save-expense`, data);
  }

  deleteExpense(id: any) {
    return this.http.delete(`${this.baseUrl}/del-expense/${id}`);
  }

  fetchTransactionForCategory(selectedCategory: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('expenseName', selectedCategory);
    return this.http.get(`${this.baseUrl}/get-expense`, {
      params: queryParams,
    });
  }
}
