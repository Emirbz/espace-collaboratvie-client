import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import User from '../models/User';
import UserStats from '../models/userStats';
import Room from '../models/Room';
import Topic from '../models/Topic';
import Reply from '../models/Reply';

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

  getUserStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.userUrl}/stats`);
  }

  getUserRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.userUrl}/room`);
  }

  getUserTopics(): Observable<Topic[]> {
    return this.http.get<Topic[]>(`${this.userUrl}/topic`);
  }

  getUserReplies(): Observable<Reply[]> {
    return this.http.get<Reply[]>(`${this.userUrl}/reply`);
  }


  setUser(user: User) {
    this.user.next(user);


  }

  getUser(): Observable<User> {
    return this.user$;
  }
}
