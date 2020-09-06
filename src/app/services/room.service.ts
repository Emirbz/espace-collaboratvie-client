import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import Room from '../models/Room';
import {environment} from '../../environments/environment';

@Injectable()
export class RoomService {

  roomUrl = environment.apis.rooms;

  constructor(private http: HttpClient) {
  }

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.roomUrl}`);
  }

  addRoom(newRoom): Observable<Room> {

    return this.http.post<Room>(`${this.roomUrl}`, newRoom);
  }

  deleteRoom(id): Observable<Room> {
    return this.http.delete<Room>(`${this.roomUrl}/${id}`);
  }

  joinRoom(id): Observable<Room> {
    return this.http.put<Room>(`${this.roomUrl}/join/${id}`, null);

  }

  addUsers(id, users): Observable<Room> {
    return this.http.put<Room>(`${this.roomUrl}/users/${id}`, users);

  }

  leavRoom(id): Observable<Room> {
    return this.http.put<Room>(`${this.roomUrl}/leave/${id}`, null);

  }

  getRoom(id): Observable<Room> {
    return this.http.get<Room>(`${this.roomUrl}/${id}`);
  }


}
