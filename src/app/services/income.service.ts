import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
const baseUrl = 'http://192.168.1.22:8080/api/v1/income';

@Injectable({
  providedIn: 'root',
})
export class IncomeService {

  constructor(private http: HttpClient) {}

  getCurrentIncome(month: any, year: any): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('month', month).append('year', year);
    return this.http.get(`${baseUrl}/get-current-income`, { params: queryParams });
  }

  getAllIncomes(): Observable<any> {
    return this.http.get(`${baseUrl}/get-all-incomes`);
  }

  get(name: any) {
    return this.http.get(`${baseUrl}/${name}`);
  }

  updateIncome(form: any) {
    return this.http.post(`${baseUrl}/update-income`, form);
  }

  filterIncome(month: any, year: any) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('month', month).append('year', year);
    return this.http.get(`${baseUrl}/filter-income`, { params: queryParams });
  }

  fetchParentIncome() {
    return this.http.get(`${baseUrl}/fetch-parent-income`);
  }

  saveIncome(data: any) {
    return this.http.post(`${baseUrl}/save-income`, data);
  }

  deleteIncome(id: any) {
    return this.http.delete(`${baseUrl}/del-income/${id}`);
  }

}