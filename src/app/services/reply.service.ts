import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import Reply from '../models/Reply';
import Room from '../models/Room';

@Injectable()
export class ReplyService {

  replyUrl = environment.apis.reply;

  constructor(private http: HttpClient) {
  }

  addReply(newReply): Observable<Reply> {

    return this.http.post<Reply>(`${this.replyUrl}`, newReply);
  }

  likeReply(replyId): Observable<Reply> {

    return this.http.put<Reply>(`${this.replyUrl}/like/${replyId}`, null);
  }

  getReplies(id): Observable<Reply[]> {
    return this.http.get<Reply[]>(`${this.replyUrl}/topic/${id}`);
  }

  deleteReply(id): Observable<Room> {
    return this.http.delete<Room>(`${this.replyUrl}/${id}`);
  }

}
