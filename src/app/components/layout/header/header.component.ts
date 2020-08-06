import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import User from '../../../models/User';
import {UserService} from '../../../services/user.service';
import {SearchService} from '../../../services/search.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  title: string;
  loggedUser: User;

  constructor(private elementRef: ElementRef,
              private titleService: TitleService,
              private cdr: ChangeDetectorRef,
              private  userService: UserService,
              private searchService: SearchService) {
  }

  ngAfterViewInit() {

  }

  ngOnInit() {
    this.titleService.getTitle().subscribe(appTitle => {
      this.title = appTitle;
      this.cdr.detectChanges();

    });
    this.getLoggedUser();

  }

  getLoggedUser() {
    this.userService.getUser().subscribe(user => {
      this.loggedUser = user;
    });
  }

  onSearchChange(event) {
    console.log('Header :' + event.target.value);
    this.searchService.setValue(event.target.value);
  }
}
