import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import Room from '../models/Room';
import User from '../models/User';

@Injectable()
export class UserService {

  userUrl = environment.apis.user;

  constructor(private http: HttpClient) { }
  getUsers(): Observable<User[]> {
    return  this.http.get<User[]>(`${this.userUrl}`);
  }
}
