import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
const baseUrl = 'http://192.168.164.117:8080/api/v1/expense';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {

  constructor(private http: HttpClient) {}

  getCurrentExpense(month: any, year: any): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('month', month).append('year', year);
    return this.http.get(`${baseUrl}/get-current-expense`, { params: queryParams });
  }

  getAllExpenses(): Observable<any> {
    return this.http.get(`${baseUrl}/get-all-expenses`);
  }

  get(name: any) {
    return this.http.get(`${baseUrl}/${name}`);
  }

  updateExpense(form: any) {
    return this.http.post(`${baseUrl}/update-expense`, form);
  }

  filterExpense(month: any, year: any) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('month', month).append('year', year);
    return this.http.get(`${baseUrl}/filter-expense`, { params: queryParams });
  }

  fetchParentExpense() {
    return this.http.get(`${baseUrl}/fetch-parent-expense`);
  }

  saveExpense(data: any) {
    return this.http.post(`${baseUrl}/save-expense`, data);
  }

  deleteExpense(id: any) {
    return this.http.delete(`${baseUrl}/del-expense/${id}`);
  }

}