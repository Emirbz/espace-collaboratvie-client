import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
import Room from '../../../models/Room';
import {RoomService} from '../../../services/room.service';
import User from '../../../models/User';
import {UserService} from '../../../services/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {TitleService} from '../../../services/title.service';


@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class RoomsComponent implements OnInit, AfterViewInit {
  loadedRooms: Room[];
  selectedUsers: any;
  loadedUsers: User[];
  roomCreated = false;
  toastSucces = 'alert alert-success d-none';
  roomFormGroup: FormGroup;
  formError: 'form-group label-floating';
  selectedUsersModal: User[];


  constructor(
    private roomService: RoomService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private titleService: TitleService
  ) {
  }

  ngAfterViewInit(): void {


  }

  ngOnInit() {
    this.loadRooms();
    this.loadUsers();
    this.roomFormValidate();
    this.setTitle();
  }

  public loadScript(url) {
    const node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    document.getElementsByTagName('body')[0].appendChild(node);
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
    if (this.roomFormGroup.valid) {
      this.roomCreated = true;

      const {name, subject} = this.roomFormGroup.value;
      const usertoPersist: User[] = [];
      this.selectedUsers.forEach(value => {
        const u = new User(value, null, null, null);
      });
      const dataRoom = {
        name,
        subject,
        users: usertoPersist
      };
      this.roomService.addRoom(dataRoom).subscribe(room => {
        this.loadedRooms.push(room);

        this.showSucces();
        this.loadRooms();

      });
    }
  }


  joinRoom(id: number) {
    this.router.navigate(['rooms', id]);

  }

  openModalAllUsers(users: User[]) {
    this.selectedUsersModal = users;
  }


}
