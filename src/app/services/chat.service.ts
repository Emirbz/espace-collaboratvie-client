import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import Message from '../models/Message';

@Injectable()
export class ChatService {

  msgUrl = environment.apis.message;
  sondageUrl = environment.apis.sondage;

  constructor(private http: HttpClient) {
  }


  getImagesByRoom(id): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.msgUrl}/images/${id}`);
  }

  addMessage(newMessage): Observable<Message> {

    return this.http.post<Message>(`${this.msgUrl}`, newMessage);
  }

  getMessageByRoom(id): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.msgUrl}/room/${id}`);
  }

  getSondagesByRoom(id): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.sondageUrl}/room/${id}`);
  }
}
