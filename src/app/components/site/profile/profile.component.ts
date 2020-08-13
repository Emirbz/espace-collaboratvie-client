import {AfterViewInit, Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import User from '../../../models/User';
import {TitleService} from '../../../services/title.service';
import Room from '../../../models/Room';
import Topic from '../../../models/Topic';
import Reply from '../../../models/Reply';
import UserStats from '../../../models/userStats';
import {ReplyService} from '../../../services/reply.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit {
  loggedUser: User;
  topicsClass = 'd-none';
  searchPlaceHolder = 'Rechercher parmis vos topics ...';
  roomsClass = 'row  fade-in';
  topicsSelected = '';
  roomsSelected = ' selected scale-up-open';
  firstNavName = 'Mes groupes';
  secondNavName = 'Groupes crées';
  myCommentsClass = 'event-item-table';
  myTopicsClass = 'd-none';
  myRooms: Room[];
  myTopics: Topic[];
  myReplies: Reply[];
  myStats: UserStats;
  itemToDelete: string;
  replyToDelete: Reply;
  topicToDelete: Topic;
  roomToDelete: Room;

  constructor(
    private  userService: UserService,
    private titleService: TitleService,
    private replyService: ReplyService
  ) {
  }

  ngOnInit() {
    this.getLoggedUser();
    this.setTitle();
    this.loadMyReplies();
    this.loadMyRooms();
    this.loadMyTopics();
    this.loadMyStats();

  }

  getLoggedUser() {
    this.userService.getUser().subscribe(user => {
      this.loggedUser = user;
    });
  }

  displayRooms() {
    this.topicsClass = 'd-none';
    this.roomsClass = 'row  fade-in';
    this.searchPlaceHolder = 'Rechercher parmis vos  groupes de dicsucssion ...';
    this.roomsSelected = 'selected scale-up-open';
    this.topicsSelected = '';
    this.firstNavName = 'Mes groupes';
    this.secondNavName = 'Groupes crées';
  }

  ngAfterViewInit() {

  }


  displayTopics() {
    this.topicsClass = 'ui-block fade-in';
    this.roomsClass = 'd-none';
    this.searchPlaceHolder = 'Rechercher parmis vos topics ...';
    this.topicsSelected = 'selected scale-up-open';
    this.roomsSelected = '';
    this.firstNavName = 'Commentaires';
    this.secondNavName = 'Topic';


  }

  loadMyRooms() {
    this.userService.getUserRooms().subscribe(room => {
      this.myRooms = room;

    });
  }

  loadMyTopics() {
    this.userService.getUserTopics().subscribe(topic => {
      this.myTopics = topic;

    });
  }

  loadMyReplies() {
    this.userService.getUserReplies().subscribe(reply => {
      this.myReplies = reply;

    });
  }

  loadMyStats() {
    this.userService.getUserStats().subscribe(stats => {
      this.myStats = stats;

    });
  }

  setTitle() {

    this.titleService.setTitle('Profile');
  }

  firstNav() {
    if (this.firstNavName === 'Commentaires') {
      this.searchPlaceHolder = 'Rechercher parmis vos topics ...';
      this.myCommentsClass = 'event-item-table animated bounceInDown';
      this.myTopicsClass = 'd-none';
    }

  }


  secondNav() {
    if (this.secondNavName === 'Topic') {
      this.searchPlaceHolder = 'Rechercher parmis vos commentaires ...';
      this.myTopicsClass = 'event-item-table animated bounceInDown';
      this.myCommentsClass = 'd-none';
    }

  }

  deleteModal(type: string, reply?: Reply, room?: Room, topic?: Topic) {
    this.itemToDelete = type;
    switch (type) {
      case 'REPLY':
        this.replyToDelete = reply;
        break;
      case 'TOPIC':
        this.topicToDelete = topic;
        break;
      case 'ROOM':
        this.roomToDelete = room;
        break;
    }

  }

  deleteReply(reply: Reply) {
    this.replyService.deleteReply(reply.id).subscribe(() => {
      this.myReplies = this.myReplies.filter(r => r !== reply);
    });
  }

  deleteRoom(roomToDelete: Room) {

  }

  deleteTopic(topicToDelete: Topic) {

  }
}
