import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActionType } from 'src/types/action.type';
import { CommentActionsType } from 'src/types/comment-actions.type';
import { CommentsResponseType } from 'src/types/comments-response.type';
import { DefaultResponseType } from 'src/types/default-response.type';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  http = inject(HttpClient);

  addComment(article: string, text: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(`${environment.api}comments`, { article, text });
  }

  getComments(offset: number, article: string):Observable<CommentsResponseType> {
    return this.http.get<CommentsResponseType>(`${environment.api}comments`, { params: { offset, article } });
  }

  applyAction(commentId: string, action: ActionType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(`${environment.api}comments/${commentId}/apply-action`, { action });
  }

  getArticleCommentActions(articleId: string): Observable<CommentActionsType[]> {
    return this.http.get<CommentActionsType[]>(`${environment.api}comments/article-comment-actions`, { params: { articleId } });
  }

  getUserActionsforComment(commentId: string): Observable<CommentActionsType[]> {
    return this.http.get<CommentActionsType[]>(`${environment.api}comments/${commentId}/actions`);
  }
}
