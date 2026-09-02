import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '../providers/app-config.service';

@Injectable({
  providedIn: 'root',
})
export class SavingsService {
  baseUrl: any;

  constructor(private http: HttpClient, private config: AppConfigService) {
    this.baseUrl = this.config.getConfig().bffServiceUrl + '/api/v1/savings';
  }

  getCurrentSavings(month: any, year: any): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('month', month).append('year', year);
    return this.http.get(`${this.baseUrl}/get-current-savings`, {
      params: queryParams,
    });
  }

  get(name: any) {
    return this.http.get(`${this.baseUrl}/${name}`);
  }

  updateSavings(form: any) {
    return this.http.post(`${this.baseUrl}/update-savings`, form);
  }

  saveSavings(data: any) {
    return this.http.post(`${this.baseUrl}/save-savings`, data);
  }

  deleteSavings(id: any) {
    return this.http.delete(`${this.baseUrl}/del-savings/${id}`);
  }

  fetchTransactionForCategory(selectedCategory: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('savingsName', selectedCategory);
    return this.http.get(`${this.baseUrl}/get-savings`, {
      params: queryParams,
    });
  }
}
