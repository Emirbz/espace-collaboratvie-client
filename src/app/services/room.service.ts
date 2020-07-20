import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import Room from '../models/Room';
import {environment} from '../../environments/environment';

@Injectable()
export class RoomService {

  roomUrl = environment.apis.rooms;

  constructor(private http: HttpClient) { }
  getRooms(): Observable<Room[]> {
 return  this.http.get<Room[]>(`${this.roomUrl}`);
  }
  addRoom(newRoom): Observable<Room> {

    return this.http.post<Room>(`${this.roomUrl}/add`, newRoom);
  }
  deleteProduct(id): Observable<Room> {
    return this.http.delete<Room>(`${this.roomUrl}/${id}`);
  }
  updateProduct(id, updatedRoom): Observable<Room> {
    return this.http.put<Room>(`${this.roomUrl}/${id}`, updatedRoom);

  }
  getRoom(id): Observable<Room> {
    return this.http.get<Room>(`${this.roomUrl}/${id}`);
  }


}
