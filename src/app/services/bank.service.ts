import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '../providers/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  baseUrl: any;

  constructor(private http: HttpClient, private config: AppConfigService) {
    this.baseUrl = this.config.getConfig().bffServiceUrl + '/api/v1/bank';
  }

  getCurrentBankRecord(month: any, year: any): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('month', month).append('year', year);
    return this.http.get(`${this.baseUrl}/get-current-bank-record`, {
      params: queryParams,
    });
  }

  saveBankRecord(data: any) {
    return this.http.post(`${this.baseUrl}/save-bank-record`, data);
  }

  get(name: any) {
    return this.http.get(`${this.baseUrl}/${name}`);
  }

  updateBankRecord(form: any) {
    return this.http.post(`${this.baseUrl}/update-bank-record`, form);
  }


  deleteBankRecord(id: any) {
    return this.http.delete(`${this.baseUrl}/del-bank-record/${id}`);
  }

  fetchTransactionForCategory(selectedCategory: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('expenseName', selectedCategory);
    return this.http.get(`${this.baseUrl}/get-expense`, {
      params: queryParams,
    });
  }
}
