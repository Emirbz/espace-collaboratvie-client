import {AfterViewInit, Component, ElementRef} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  constructor(private elementRef: ElementRef) {
  }

  ngAfterViewInit() {
    const s = document.createElement('script');
    s.src = 'assets/js/main.js';
    this.elementRef.nativeElement.appendChild(s);
    const s1 = document.createElement('script');
    s1.src = 'assets/js/libs-init/libs-init.js';
    this.elementRef.nativeElement.appendChild(s1);
  }
}

