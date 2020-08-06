import {Injectable} from '@angular/core';

import {BehaviorSubject, Observable} from 'rxjs';

@Injectable()
export class SearchService {

  private value = new BehaviorSubject<string>('');
  private value$ = this.value.asObservable();


  constructor() {
  }

  setValue(value: string) {
    this.value.next(value);


  }

  getValue(): Observable<string> {
    return this.value$;
  }
}
