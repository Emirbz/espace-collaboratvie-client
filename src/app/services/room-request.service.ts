import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import RoomRequest from '../models/RoomRequest';

@Injectable()
export class RoomRequestService {

  roomRequestUrl = environment.apis.roomRequest;

  constructor(private http: HttpClient) {
  }

  getMyRooMRequests(): Observable<RoomRequest[]> {
    return this.http.get<RoomRequest[]>(`${this.roomRequestUrl}`);
  }
  
}
