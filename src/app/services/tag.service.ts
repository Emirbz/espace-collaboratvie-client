import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import Tag from '../models/Tag';

@Injectable()
export class TagService {


  tagUrl = environment.apis.tag;

  constructor(private http: HttpClient) {
  }

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.tagUrl}`);
  }

  getTopic(searchToken): Observable<Tag> {
    return this.http.get<Tag>(`${this.tagUrl}/topic/${searchToken}`);
  }
}
