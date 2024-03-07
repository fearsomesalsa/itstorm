import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoryType } from 'src/types/category.type';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  http = inject(HttpClient);

  getCategories(): Observable<CategoryType[]> {
    return this.http.get<CategoryType[]>(`${environment.api}categories`);
  }
}
