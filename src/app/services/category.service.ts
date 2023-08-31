import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  url: any;

  constructor(private httpClient: HttpClient) {
    this.url = 'http://localhost:8080/category/v1';
  }

  getAllCategories(): Observable<any> {
    return this.httpClient.get(this.url + '/get-all-categories');
  }
}
