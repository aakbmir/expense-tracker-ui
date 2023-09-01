import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Form } from '@angular/forms';
import { Observable } from 'rxjs';
const baseUrl = 'http://localhost:8080/api/v1/budget';

@Injectable({
  providedIn: 'root',
})

export class BudgetService {

  constructor(private http: HttpClient) {}

  getAllBudgets(): Observable<any> {
    return this.http.get(`${baseUrl}/get-all-budgets`);
  }

  get(budgetName: any) {
    return this.http.get(`${baseUrl}/${budgetName}`);
  }

  updateBudget(form: any) {
    return this.http.post(`${baseUrl}/update-budget`, form);
  }

  filterBudget(month: any, year: any) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('month', month).append('year', year);
    return this.http.get(`${baseUrl}/filter-budget`, { params: queryParams });
  }

  fetchUmbrellaBudget() {
    return this.http.get(`${baseUrl}/fetch-umbrella-budget`);
  }

  saveBudget(data: any) {
    return this.http.post(`${baseUrl}/save-budget`, data);
  }

  deleteBudget(id: any) {
    return this.http.delete(`${baseUrl}/del-budget/${id}`);
  }
}