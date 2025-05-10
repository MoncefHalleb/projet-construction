import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8088/api/services/user';

  constructor(private http: HttpClient) {}

  getUserById(id_User: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id_User}`);
  }
}
