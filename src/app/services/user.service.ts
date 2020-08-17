import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import User from '../models/User';
import UserStats from '../models/UserStats';
import Room from '../models/Room';
import Topic from '../models/Topic';
import Reply from '../models/Reply';

@Injectable()
export class UserService {

  userUrl = environment.apis.user;
  url: string;

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

  getUserStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.userUrl}/stats`);
  }

  getUserRooms(name?: string): Observable<Room[]> {
    if (name) {
      this.url = `${this.userUrl}/room?name=${name}`;
    } else {
      this.url = `${this.userUrl}/room`;
    }
    return this.http.get<Room[]>(this.url);
  }

  getUserTopics(name?: string): Observable<Topic[]> {
    if (name) {
      this.url = `${this.userUrl}/topic?name=${name}`;
    } else {
      this.url = `${this.userUrl}/topic`;
    }
    return this.http.get<Topic[]>(this.url);
  }

  getUserReplies(name?: string): Observable<Reply[]> {
    if (name) {
      this.url = `${this.userUrl}/reply?name=${name}`;
    } else {
      this.url = `${this.userUrl}/reply`;
    }
    return this.http.get<Reply[]>(this.url);
  }


  setUser(user: User) {
    this.user.next(user);


  }

  getUser(): Observable<User> {
    return this.user$;
  }
}
