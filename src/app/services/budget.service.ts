import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Form } from '@angular/forms';
import { Observable } from 'rxjs';
const baseUrl = 'http://192.168.0.141:8080/api/v1/budget';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  constructor(private http: HttpClient) {}

  getCurrentBudget(month: any, year: any): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('month', month).append('year', year);
    return this.http.get(`${baseUrl}/get-current-budget`, { params: queryParams });
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

  fetchParentBudget() {
    return this.http.get(`${baseUrl}/fetch-parent-budget`);
  }

  saveBudget(data: any) {
    return this.http.post(`${baseUrl}/save-budget`, data);
  }

  deleteBudget(id: any) {
    return this.http.delete(`${baseUrl}/del-budget/${id}`);
  }
}
