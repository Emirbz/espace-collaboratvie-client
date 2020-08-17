import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import Reply from '../models/Reply';

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

  deleteReply(id): Observable<Reply> {
    return this.http.delete<Reply>(`${this.replyUrl}/${id}`);
  }

  setUseful(r: Reply): Observable<Reply> {
    return this.http.put<Reply>(`${this.replyUrl}/${r.id}`, null);
  }
}
