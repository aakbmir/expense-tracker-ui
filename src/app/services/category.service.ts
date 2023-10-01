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
    this.baseUrl = this.config.getConfig().bffServiceUrl+'/api/v1/category';
  }

  getAllCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-all-categories`);
  }

  get(categoryName: any) {
    return this.http.get(`${this.baseUrl}/${categoryName}`);
  }

  updateCategory(form: any) {
    return this.http.post(`${this.baseUrl}/update-category`, form);
  }

  filterCategory(month: any, year: any) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('month', month).append('year', year);
    return this.http.get(`${this.baseUrl}/filter-category`, { params: queryParams });
  }


  saveCategory(data: any) {
    return this.http.post(`${this.baseUrl}/save-category`, data);
  }

  deleteCategory(id: any) {
    return this.http.delete(`${this.baseUrl}/del-category/${id}`);
  }


}
