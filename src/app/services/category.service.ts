import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '../providers/app-config.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  baseUrl: any;

  constructor(private http: HttpClient, private config: AppConfigService) {
    this.baseUrl = this.config.getConfig().bffServiceUrl + '/api/v1/category';
  }

  getAllCategories(month?: any, year?: any, showInactive: boolean = false): Observable<any> {
    let queryParams = new HttpParams();
    if (month !== undefined && month !== null) {
      queryParams = queryParams.append('month', month);
    }
    if (year !== undefined && year !== null) {
      queryParams = queryParams.append('year', year);
    }
    queryParams = queryParams.append('showInactive', showInactive.toString());
    return this.http.get(`${this.baseUrl}/get-all-categories`, {
      params: queryParams,
    });
  }

  get(categoryName: any) {
    return this.http.get(`${this.baseUrl}/${categoryName}`);
  }

  updateCategory(form: any) {
    return this.http.post(`${this.baseUrl}/update-category`, form);
  }

  saveCategory(data: any) {
    return this.http.post(`${this.baseUrl}/save-category`, data);
  }

  deleteCategory(id: any, action: string) {
    return this.http.delete(`${this.baseUrl}/del-category/${id}`, {
      body: { action },
    });
  }

  addAllCategories(month: any, year: any): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('month', month - 1).append('year', year);
    return this.http.get(`${this.baseUrl}/add-all-categories`, {
      params: queryParams,
    });
  }
}
