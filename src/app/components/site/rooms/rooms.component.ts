import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
import Room from '../../../models/Room';
import {RoomService} from '../../../services/room.service';
import User from '../../../models/User';
import {UserService} from '../../../services/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {TitleService} from '../../../services/title.service';
import {ToastBootsrapService} from '../../../services/toast-bootsrap.service';


@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class RoomsComponent implements OnInit, AfterViewInit {
  /* ------- LOADED SERVICES--------------*/
  loadedRooms: Room[];
  loadedUsers: User[];
  loggedUser: User;
  selectedUsersModal: User[];
  /* ---- Select dropdown USers*/
  selectedUsers: any;
  /* --------- Loader Post room --------*/
  roomCreated = false;
  toastSucces = 'alert alert-success d-none';
  roomFormGroup: FormGroup;
  roomsHaveBeenLoaded = false;
  /*---- Room request class ---- */
  requestedRoom: Room;

  constructor(
    private roomService: RoomService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private titleService: TitleService,
    private toastBootsrapService: ToastBootsrapService
  ) {
  }

  ngAfterViewInit(): void {


  }

  ngOnInit() {

    this.loadRooms();
    this.loadUsers();
    this.roomFormValidate();
    this.setTitle();
    this.getLoggedUser();
  }


  roomFormValidate() {
    this.roomFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      subject: ['', Validators.required],
      users: [''],
    });

  }

  setTitle() {
    this.titleService.setTitle('Groupes des discussion');
  }

  loadRooms() {
    this.roomService.getRooms().subscribe(r => {
      this.roomsHaveBeenLoaded = true;
      this.loadedRooms = r;
    });
  }

  loadUsers() {
    this.userService.getUsers().subscribe(u => {
      this.loadedUsers = u;
    });

  }

  showSucces() {
    this.toastSucces = 'alert alert-success animated bounceInDown';
    setTimeout(() => {

      this.toastSucces = 'alert alert-success animated bounceOutUp';
      setTimeout(() => {
        // @ts-ignore
        $('#create-friend-group-1').modal('toggle');
        this.toastSucces = 'alert alert-succes d-none';
        this.roomCreated = false;
      }, 400);
    }, 1500);


  }

  addRoom() {
    if (!this.roomFormGroup.valid) {
      return;
    }
    this.roomCreated = true;
    const {name, subject} = this.roomFormGroup.value;
    const usertoPersist: User[] = [];
    this.selectedUsers.forEach(idUser => {
      const u = new User(idUser, null, null, null);
      usertoPersist.push(u);
    });
    const dataRoom = {
      name,
      subject,
      users: usertoPersist,
      user: this.loggedUser
    };
    this.roomService.addRoom(dataRoom).subscribe(room => {
      this.showSucces();
      this.loadRooms();
      this.roomFormGroup.reset();

    });
  }


  joinRoom(id: number) {

    this.router.navigate(['rooms', id]);

  }


  openModalAllUsers(users: User[]) {
    this.selectedUsersModal = users;
  }


  joinRoomRequest(room: Room) {
    if (room.requestStatus === null) {
      this.roomService.joinRoom(room.id).subscribe(() => {
        room.requestStatus = 'PENDING';
        this.requestedRoom = room;
      });
    }

    // TODO request join room

  }

  getLoggedUser() {
    this.userService.getUser().subscribe(user => {
      this.loggedUser = user;
    });

  }

  showToast() {
    const id = Date.now();
    this.toastBootsrapService.show(id, 'titre', 'Welcomee to your friends groups! Do you wanna know what ', {timestamp: 'tawa tawa'});
  }
}
