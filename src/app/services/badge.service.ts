import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import Badge from '../models/Badge';

@Injectable()
export class BadgeService {

  badgeUrl = environment.apis.badge;

  constructor(private http: HttpClient) {
  }

  getAllBadges(): Observable<Badge[]> {
    return this.http.get<Badge[]>(`${this.badgeUrl}`);
  }

}
