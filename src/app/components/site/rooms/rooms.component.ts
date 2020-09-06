import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
import Room, {Status} from '../../../models/Room';
import {RoomService} from '../../../services/room.service';
import User from '../../../models/User';
import {UserService} from '../../../services/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {TitleService} from '../../../services/title.service';
import {Duration, Icon, ToastBootsrapService} from '../../../services/toast-bootsrap.service';


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

  /* --------- Loader Post room --------*/
  roomCreated = false;
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
      users: [this.loadedUsers],
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


  addRoom() {
    if (!this.roomFormGroup.valid) {
      return;
    }
    this.roomCreated = true;
    const {name, subject} = this.roomFormGroup.value;
    const usertoPersist: User[] = [];
    this.roomFormGroup.value.users.forEach(idUser => {
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
      // @ts-ignore
      $('#create-friend-group-1').modal('toggle');
      this.showToast('Groupe crée', 'Votre groupe de discussion a été crée avec success', undefined, undefined, Duration.long);
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
    if (room.requestStatus === null || room.requestStatus === Status.REJECTED) {
      this.roomService.joinRoom(room.id).subscribe(() => {
        room.requestStatus = Status.PENDING;
        this.requestedRoom = room;
        this.showToast('Demande envoyée', 'Votre demande a été envoyée au proprietaire du groupe', Icon.info, undefined, Duration.long);
      });
    }

    // TODO request join room

  }

  getLoggedUser() {
    this.userService.getUser().subscribe(user => {
      this.loggedUser = user;
    });

  }

  showToast(title: string, description: string, icon?: Icon, timestamp?: string, duration?: Duration) {
    const id = Date.now();
    this.toastBootsrapService.show(id, title, description, {
      timestamp,
      icon,
      duration
    });
  }
}
