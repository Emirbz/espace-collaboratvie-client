import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {take} from 'rxjs/operators';
import {PathResolveService} from '../../../services/path-resolve.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit, OnDestroy {
  path: string;


  constructor(
    private route: ActivatedRoute,
    private pathResolveservice: PathResolveService
  ) {
  }

  ngOnInit() {
    this.pathResolveservice.setStatus(404);
    this.route.data.pipe(take(1))
      .subscribe((data: { path: string }) => {
        this.path = data.path;
      });
  }

  ngOnDestroy(): void {
    this.pathResolveservice.setStatus(200);
  }

}
