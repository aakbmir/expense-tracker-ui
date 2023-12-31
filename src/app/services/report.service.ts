import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '../providers/app-config.service';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  baseUrl: any;

  constructor(private http: HttpClient, private config: AppConfigService) {
    this.baseUrl = this.config.getConfig().bffServiceUrl + '/api/v1/reports';
  }

  groupedReport(month: any, year: any): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('month', month).append('year', year);
    return this.http.get(`${this.baseUrl}/grouped-report`, {
      params: queryParams,
    });
  }

  categoryReport(month: any, year: any): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('month', month).append('year', year);
    return this.http.get(`${this.baseUrl}/category-report`, {
      params: queryParams,
    });
  }

  overviewReport(month: any, year: any): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('month', month).append('year', year);
    return this.http.get(`${this.baseUrl}/overview-report`, {
      params: queryParams,
    });
  }

  fetchCategoryReportDetails(
    item: any,
    month: any,
    year: any
  ): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams
      .append('category', item)
      .append('month', month)
      .append('year', year);
    return this.http.get(`${this.baseUrl}/category-report-details`, {
      params: queryParams,
    });
  }

  superCategoryReport(month: any, year: any): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('month', month).append('year', year);
    return this.http.get(`${this.baseUrl}/super-category-report`, {
      params: queryParams,
    });
  }

  fetchSuperCategoryReportDetails(
    item: any,
    month: any,
    year: any
  ): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams
      .append('superCategory', item)
      .append('month', month)
      .append('year', year);
    return this.http.get(`${this.baseUrl}/super-category-report-details`, {
      params: queryParams,
    });
  }

  trendsReport() {
    return this.http.get(`${this.baseUrl}/trends-report`);
  }

  savingsReport(): Observable<any> {
    return this.http.get(`${this.baseUrl}/savings-report`);
  }

  bankReport(): Observable<any> {
    return this.http.get(`${this.baseUrl}/bank-report`);
  }

  fetchAllCategoriesDetails() {
    return this.http.get(`${this.baseUrl}/get-distinct-categories`);
  }

  fetchTransactionForCategory(selectedCategory: string, option: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams
      .append('expenseName', selectedCategory)
      .append('option', option);
    return this.http.get(`${this.baseUrl}/get-expense`, {
      params: queryParams,
    });
  }
}
