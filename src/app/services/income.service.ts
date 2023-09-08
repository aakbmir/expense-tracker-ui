import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '../providers/app-config.service';

@Injectable({
  providedIn: 'root',
})
export class IncomeService {

  baseUrl: any;

  constructor(private http: HttpClient, private config: AppConfigService) {
    this.baseUrl = this.config.getConfig().bffServiceUrl+'/api/v1/income';
  }

  getCurrentIncome(month: any, year: any): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('month', month).append('year', year);
    return this.http.get(`${this.baseUrl}/get-current-income`, { params: queryParams });
  }

  getAllIncomes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-all-incomes`);
  }

  get(name: any) {
    return this.http.get(`${this.baseUrl}/${name}`);
  }

  updateIncome(form: any) {
    return this.http.post(`${this.baseUrl}/update-income`, form);
  }

  filterIncome(month: any, year: any) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('month', month).append('year', year);
    return this.http.get(`${this.baseUrl}/filter-income`, { params: queryParams });
  }

  fetchParentIncome() {
    return this.http.get(`${this.baseUrl}/fetch-parent-income`);
  }

  saveIncome(data: any) {
    return this.http.post(`${this.baseUrl}/save-income`, data);
  }

  deleteIncome(id: any) {
    return this.http.delete(`${this.baseUrl}/del-income/${id}`);
  }

}