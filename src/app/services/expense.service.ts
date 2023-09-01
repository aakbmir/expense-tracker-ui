import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Form } from '@angular/forms';
import { Observable } from 'rxjs';
const baseUrl = 'http://localhost:8080/api/v1/expense';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {

  constructor(private http: HttpClient) {}

  getAllExpenses(): Observable<any> {
    return this.http.get(`${baseUrl}/get-all-expenses`);
  }

  get(expenseName: any) {
    return this.http.get(`${baseUrl}/${expenseName}`);
  }

  updateExpense(form: any) {
    return this.http.post(`${baseUrl}/update-expense`, form);
  }

  filterExpense(month: any, year: any) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('month', month).append('year', year);
    return this.http.get(`${baseUrl}/filter-expense`, { params: queryParams });
  }

  fetchUmbrellaExpense() {
    return this.http.get(`${baseUrl}/fetch-umbrella-expense`);
  }

  saveExpense(data: any) {
    return this.http.post(`${baseUrl}/save-expense`, data);
  }

  deleteExpense(id: any) {
    return this.http.delete(`${baseUrl}/del-expense/${id}`);
  }


}
