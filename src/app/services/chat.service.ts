import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import Message from '../models/Message';
import Choix from '../models/Choix';
import Reaction from '../models/Reaction';
import LinkPreview from '../models/LinkPreview';

@Injectable()
export class ChatService {

  msgUrl = environment.apis.message;
  sondageUrl = environment.apis.sondage;
  voteUrl = environment.apis.vote;
  reactionUrl = environment.apis.reaction;

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

  addSondage(newSondage): Observable<Message> {

    return this.http.post<Message>(`${this.sondageUrl}`, newSondage);
  }

  voteSondage(id, user): Observable<Choix> {
    return this.http.post<Choix>(`${this.voteUrl}/${id}`, user);
  }


  addReaction(newReaction): Observable<Reaction> {

    return this.http.post<Reaction>(`${this.reactionUrl}`, newReaction);
  }

  getLinkPreview(link): Observable<LinkPreview> {
    return this.http.get<LinkPreview>(`${environment.apis.linkPreview}${link}`);
  }

}
