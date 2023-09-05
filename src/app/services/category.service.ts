import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Form } from '@angular/forms';
import { Observable } from 'rxjs';
const baseUrl = 'http://192.168.0.141:8080/api/v1/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<any> {
    return this.http.get(`${baseUrl}/get-all-categories`);
  }

  get(categoryName: any) {
    return this.http.get(`${baseUrl}/${categoryName}`);
  }

  updateCategory(form: any) {
    return this.http.post(`${baseUrl}/update-category`, form);
  }

  filterCategory(month: any, year: any) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('month', month).append('year', year);
    return this.http.get(`${baseUrl}/filter-category`, { params: queryParams });
  }

  fetchParentCategory() {
    return this.http.get(`${baseUrl}/fetch-parent-category`);
  }

  saveCategory(data: any) {
    return this.http.post(`${baseUrl}/save-category`, data);
  }

  deleteCategory(id: any) {
    return this.http.delete(`${baseUrl}/del-category/${id}`);
  }


}
