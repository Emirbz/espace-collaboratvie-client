import {Component, ElementRef, OnInit} from '@angular/core';
import {UserService} from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private elementRef: ElementRef,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getLoggedUser().subscribe(value => {
      this.userService.setUser(value);
    });
  }
}

