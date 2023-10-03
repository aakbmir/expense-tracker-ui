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

  overviewReport(month: any, year: any): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('month', month).append('year', year);
    return this.http.get(`${this.baseUrl}/overview-report`, {
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

  superCategoryReport(month: any, year: any): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('month', month).append('year', year);
    return this.http.get(`${this.baseUrl}/super-category-report`, {
      params: queryParams,
    });
  }


  //
  overviewCategory(month: any, year: any): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('month', month).append('year', year);
    return this.http.get(`${this.baseUrl}/overview-category`, {
      params: queryParams,
    });
  }


  monthlyParent(month: any, year: any): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('month', month).append('year', year);
    return this.http.get(`${this.baseUrl}/monthly-parent`, {
      params: queryParams,
    });
  }

  fetchExpenseCategoryDetails(
    item: any,
    month: any,
    year: any
  ): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams
      .append('category', item)
      .append('month', month)
      .append('year', year);
    return this.http.get(`${this.baseUrl}/fetch-expense-category-details`, {
      params: queryParams,
    });
  }

  fetchCategoryDetails(item: any, month: any, year: any): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams
      .append('category', item)
      .append('month', month)
      .append('year', year);
    return this.http.get(`${this.baseUrl}/fetch-Category-Details`, {
      params: queryParams,
    });
  }

  fetchTrendsOverview() {
    return this.http.get(`${this.baseUrl}/trends-overview`);
  }

  fetchDistinctCategories() {
    return this.http.get(`${this.baseUrl}/get-distinct-categories`);
  }
}
