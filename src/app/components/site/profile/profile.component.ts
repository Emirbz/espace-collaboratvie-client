import {AfterViewInit, Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import User from '../../../models/User';
import {TitleService} from '../../../services/title.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit {
  loggedUser: User;
  topicsClass = 'd-none';
  searchPlaceHolder = 'Rechercher parmis vos topics ...';
  nth_time = [1, 2, 3, 4, 5, 6, 7];
  roomsClass = 'row animated bounceInDown';
  topicsSelected = '';
  roomsSelected = ' selected scale-up-open';
  firstNav = 'Mes groupes';
  secondNav = 'Groupes crées';


  constructor(
    private  userService: UserService,
    private titleService: TitleService
  ) {
  }

  ngOnInit() {
    this.getLoggedUser();
    this.setTitle();

  }

  getLoggedUser() {
    this.userService.getUser().subscribe(user => {
      this.loggedUser = user;
    });
  }

  displayRooms() {
    this.topicsClass = 'd-none';
    this.roomsClass = 'row animated bounceInDown';
    this.searchPlaceHolder = 'Rechercher parmis vos  groupes de dicsucssion ...';
    this.roomsSelected = 'selected scale-up-open';
    this.topicsSelected = '';
    this.firstNav = 'Mes groupes';
    this.secondNav = 'Groupes crées';
  }

  ngAfterViewInit() {
    this.loadScript('assets/js/main.js');
    this.loadScript('assets/js/libs-init/libs-init.js');
  }

  public loadScript(url) {
    const node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    document.getElementsByTagName('body')[0].appendChild(node);


  }

  displayTopics() {
    this.topicsClass = 'ui-block animated bounceInDown';
    this.roomsClass = 'd-none';
    this.searchPlaceHolder = 'Rechercher parmis vos topics ...';
    this.topicsSelected = 'selected scale-up-open';
    this.roomsSelected = '';
    this.firstNav = 'Commentaires';
    this.secondNav = 'Topic';


  }

  setTitle() {

    this.titleService.setTitle('Profile');
  }

}
