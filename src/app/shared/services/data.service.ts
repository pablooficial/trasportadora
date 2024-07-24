import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataUrl =
    'https://raw.githubusercontent.com/brunochikuji/example/main/entregas.json';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  getDados(): Observable<any[]> {
    return this.http.get<any[]>(this.dataUrl);
  }

  private log(message: string): void {
    this.messageService.add(`DataService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
