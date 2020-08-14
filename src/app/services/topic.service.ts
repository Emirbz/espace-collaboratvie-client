import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import Topic from '../models/Topic';

@Injectable()
export class TopicService {

  topicUrl = environment.apis.topic;
  url: string;

  constructor(private http: HttpClient) {
  }


  getTopics(criteria, name?): Observable<Topic[]> {
    if (name) {
      this.url = `${this.topicUrl}/tag?name=${name}`;
    } else {
      this.url = `${this.topicUrl}/tag`;
    }

    return this.http.post<Topic[]>(this.url, criteria);
  }

  addTopic(newTopic): Observable<Topic> {

    return this.http.post<Topic>(`${this.topicUrl}`, newTopic);
  }

  getTopic(id): Observable<Topic> {
    return this.http.get<Topic>(`${this.topicUrl}/${id}`);
  }

  deleteTopic(id): Observable<Topic> {
    return this.http.delete<Topic>(`${this.topicUrl}/${id}`);
  }

  getPopularTopics(): Observable<Topic[]> {
    return this.http.get<Topic[]>(`${this.topicUrl}/popular`);
  }

}
