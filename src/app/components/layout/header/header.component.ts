import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import User from '../../../models/User';
import {UserService} from '../../../services/user.service';
import {SearchService} from '../../../services/search.service';
import {Router} from '@angular/router';
import {RoomRequestService} from '../../../services/room-request.service';
import RoomRequest from '../../../models/RoomRequest';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  title: string;

  /*------ Loaded services ------- */
  loggedUser: User;
  loadedRoomRequests: RoomRequest[];
  /*------ Accept reject request animation --------- */
  acceptedRequest: RoomRequest;

  constructor(private elementRef: ElementRef,
              private titleService: TitleService,
              private cdr: ChangeDetectorRef,
              private  userService: UserService,
              private searchService: SearchService,
              private roomRequestService: RoomRequestService,
              private router: Router) {
  }

  ngAfterViewInit() {


  }

  ngOnInit() {
    this.getTitle();
    this.getLoggedUser();
    this.loadMyRoomRequests();

  }

  getLoggedUser() {
    this.userService.getUser().subscribe(user => {
      this.loggedUser = user;
    });
  }

  onSearchChange(event) {
    this.searchService.setValue(event.target.value);
  }

  profile() {
    this.router.navigate(['/profile']);
  }

  getTitle() {
    this.titleService.getTitle().subscribe(appTitle => {
      this.title = appTitle;
      this.cdr.detectChanges();

    });

  }

  private loadMyRoomRequests() {

    this.roomRequestService.getMyRooMRequests().subscribe(roomRequests => {
      this.loadedRoomRequests = roomRequests;
    });
  }

  rejectRequest(roomRequest: RoomRequest) {
    this.roomRequestService.rejectRequest(roomRequest.id).subscribe(() => {
      this.acceptedRequest = roomRequest;
      setTimeout(() => {
        this.loadedRoomRequests = this.loadedRoomRequests.filter(rr => rr !== roomRequest);
      }, 500);
    });

  }

  acceptRequest(roomRequest: RoomRequest) {
    this.roomRequestService.acceptRequest(roomRequest.id).subscribe(() => {
      this.acceptedRequest = roomRequest;
      setTimeout(() => {
        this.loadedRoomRequests = this.loadedRoomRequests.filter(rr => rr !== roomRequest);
      }, 500);
    });

  }
}
