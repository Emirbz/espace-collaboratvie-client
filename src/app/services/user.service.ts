import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import User from '../models/User';

@Injectable()
export class UserService {

  userUrl = environment.apis.user;

  private user = new BehaviorSubject<User>({});
  private user$ = this.user.asObservable();

  constructor(private http: HttpClient) {
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.userUrl}`);
  }

  getLoggedUser() {
    return this.http.get<User>(`${this.userUrl}/me`);
  }

  setUser(user: User) {
    this.user.next(user);


  }

  getUser(): Observable<User> {
    return this.user$;
  }
}
