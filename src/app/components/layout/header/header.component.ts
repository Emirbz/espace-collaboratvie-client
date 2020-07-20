import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  title: string;

  constructor(private elementRef: ElementRef,
              private titleService: TitleService,
              private cdr: ChangeDetectorRef) {
  }

  ngAfterViewInit() {

  }

  ngOnInit() {
    this.titleService.getTitle().subscribe(appTitle => {
      this.title = appTitle;
      this.cdr.detectChanges();


    });
  }
}
