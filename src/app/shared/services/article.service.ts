import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ArticleType } from 'src/types/article.type';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ArticlesWithFilterType } from 'src/types/articles-with-filter.type';
import { ActiveParamsType } from 'src/types/active-params.type';
import { ArticleCardType } from 'src/types/article-card.type';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  http = inject(HttpClient);

  getPopularArticles(): Observable<ArticleCardType[]> {
    return this.http.get<ArticleCardType[]>(`${environment.api}articles/top`);
  }

  getArticlesWithFilter(params: ActiveParamsType): Observable<ArticlesWithFilterType> {
    return this.http.get<ArticlesWithFilterType>(`${environment.api}articles`, { params });
  }

  getArticle(articleUrl: string): Observable<ArticleType> {
    return this.http.get<ArticleType>(`${environment.api}articles/${articleUrl}`);
  }

  getRelatedArticle(articleUrl: string): Observable<ArticleCardType[]> {
    return this.http.get<ArticleCardType[]>(`${environment.api}articles/related/${articleUrl}`);
  }
}
