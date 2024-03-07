import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DefaultResponseType } from 'src/types/default-response.type';
import { RequestType } from 'src/types/request.type';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  http = inject(HttpClient);

  createRequest(request: RequestType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(`${environment.api}requests`, request);
  }
}
