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

  getReplies(id): Observable<Reply[]> {
    return this.http.get<Reply[]>(`${this.replyUrl}/topic/${id}`);
  }
}
