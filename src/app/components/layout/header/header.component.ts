import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
  /* const s = document.createElement('script');
   s.src = 'assets/js/main.js';
   this.elementRef.nativeElement.appendChild(s);*/
  }

  ngOnInit() {
  }
}
