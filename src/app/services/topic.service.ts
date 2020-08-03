import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import Topic from '../models/Topic';

@Injectable()
export class TopicService {

  topicUrl = environment.apis.topic;

  constructor(private http: HttpClient) {
  }


  getTopics(criteria): Observable<Topic[]> {
    return this.http.post<Topic[]>(`${this.topicUrl}/tag`, criteria);
  }

  addTopic(newTopic): Observable<Topic> {

    return this.http.post<Topic>(`${this.topicUrl}`, newTopic);
  }

  getTopic(id): Observable<Topic> {
    return this.http.get<Topic>(`${this.topicUrl}/${id}`);
  }


}
