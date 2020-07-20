import { Component, OnInit } from '@angular/core';
import Room from '../../../models/Room';
import {RoomService} from '../../../services/room.service';
import User from '../../../models/User';
import {UserService} from '../../../services/user.service';


@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  loadedRooms: Room[];
  selectedUsers: User[];
  loadedUsers: User[];
  selectedCity:any;
  cities = [
    {id: 1, name: 'Vilnius'},
    {id: 2, name: 'Kaunas'},
    {id: 3, name: 'Pavilnys', disabled: true},
    {id: 4, name: 'Pabradė'},
    {id: 5, name: 'Klaipėda'}
  ];

  constructor(
    private roomService: RoomService,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.loadRooms();
    this.loadUsers();
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

}


