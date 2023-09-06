import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
const baseUrl = 'https://tracker-expense-be.onrender.com/api/v1/reports';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient) {}

  overviewCategory(month: any, year: any): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('month', month).append('year', year);
    return this.http.get(`${baseUrl}/overview-category`, {
      params: queryParams,
    });
  }

  monthlyCategory(month: any, year: any): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('month', month).append('year', year);
    return this.http.get(`${baseUrl}/monthly-category`, {
      params: queryParams,
    });
  }

  monthlyParent(month: any, year: any): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('month', month).append('year', year);
    return this.http.get(`${baseUrl}/monthly-parent`, {
      params: queryParams,
    });
  }

  fetchParentCategoryDetails(item: any,month: any, year: any): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('parent', item).append('month', month).append('year', year);
    return this.http.get(`${baseUrl}/fetch-Parent-Category-Details`, { params: queryParams });
  }

  fetchTrendsOverview() {
    return this.http.get(`${baseUrl}/trends-overview`);
  }
}
