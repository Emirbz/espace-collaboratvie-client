import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../../services/user.service';
import User from '../../../models/User';
import {TitleService} from '../../../services/title.service';
import Room from '../../../models/Room';
import Topic from '../../../models/Topic';
import Reply from '../../../models/Reply';
import UserStats from '../../../models/UserStats';
import {ReplyService} from '../../../services/reply.service';
import {TopicService} from '../../../services/topic.service';
import {RoomService} from '../../../services/room.service';
import {environment} from '../../../../environments/environment';
import {BadgeService} from '../../../services/badge.service';
import Badge from '../../../models/Badge';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit {
  @ViewChild('searchInput', {static: false}) searchInput: ElementRef;
  /* ----- Containers Classes */
  topicsClass = 'd-none';
  searchPlaceHolder = 'Rechercher parmis vos groupes de discussion ...';
  myroomsClass = 'row  fade-in';
  myCreatedRoomsClass = 'd-none';
  topicsSelected = '';
  roomsSelected = ' selected scale-up-open';
  badgesSelected = '';

  myCommentsClass = 'd-none';
  myTopicsClass = 'd-none';
  badgeClass = 'd-none';
  /* --------- Loaded Services --------- */
  loggedUser: User;
  myRooms: Room[];
  myTopics: Topic[];
  myReplies: Reply[];
  myTopicsInitial: Topic[];
  myRepliesInitial: Reply[];
  myRoomsInitial: Room[];
  myCreatedRoomsInitial: Room[];
  myCreatedRooms: Room[];
  loadedStats: UserStats;
  loadedBadges: Badge[];
  myBadges: Badge[];

  /*------- Delete Items------ */
  itemToDelete: string;
  replyToDelete: Reply;
  topicToDelete: Topic;
  roomToDelete: Room;
  deletedReply: Reply;
  deletedTopic: Topic;
  leftRoom: Room;
  deletedRoom: Room;
  /* ----- Navigation */
  activeNav = 'myRooms';
  firstNavName = 'Mes groupes';
  secondNavName = 'Groupes crées';
  firstNavChecked = true;
  /* --- Back Url for badge images--- */
  backUrl = environment.apis.backUrl;

  constructor(
    private  userService: UserService,
    private titleService: TitleService,
    private replyService: ReplyService,
    private topicService: TopicService,
    private roomService: RoomService,
    private badgeService: BadgeService
  ) {
  }

  ngOnInit() {
    this.getLoggedUser();
    this.setTitle();
    this.loadMyReplies();
    this.loadMyRooms();
    this.loadMyTopics();
    this.loadMyStats();
    this.loadMyCreatedRooms();
    this.loadBadges();
    this.loadMyBadges();

  }

  getLoggedUser() {
    this.userService.getUser().subscribe(user => {
      this.loggedUser = user;
    });
  }

  displayBadges() {
    this.badgesSelected = 'selected scale-up-open';
    this.roomsSelected = '';
    this.topicsSelected = '';
    this.myroomsClass = 'd-none';
    this.topicsClass = 'd-none';
    this.badgeClass = 'ui-block fade-in';

  }

  displayRooms() {
    this.firstNavChecked = true;
    this.setRoomClasses();
  }

  setRoomClasses() {
    this.searchInput.nativeElement.value = '';
    this.activeNav = 'myRooms';
    this.myRooms = this.myRoomsInitial;
    this.myCreatedRooms = this.myCreatedRoomsInitial;
    this.topicsClass = 'd-none';
    this.badgeClass = 'd-none';
    this.myroomsClass = 'row  fade-in';
    this.searchPlaceHolder = 'Rechercher parmis vos  groupes de dicsucssion ...';
    this.roomsSelected = 'selected scale-up-open';
    this.badgesSelected = '';
    this.topicsSelected = '';
    this.firstNavName = 'Mes groupes';
    this.secondNavName = 'Groupes crées';

  }

  ngAfterViewInit() {

  }


  displayTopics() {

    this.firstNavChecked = true;
    this.setTopicClasses();

  }

  setTopicClasses() {
    this.myTopics = this.myTopicsInitial;
    this.myReplies = this.myRepliesInitial;
    this.searchInput.nativeElement.value = '';
    this.topicsClass = 'ui-block fade-in';
    this.myroomsClass = 'd-none';
    this.badgeClass = 'd-none';
    this.myCommentsClass = ' event-item-table animated bounceInDown';
    this.myTopicsClass = 'd-none';
    this.myCreatedRoomsClass = 'd-none';
    this.searchPlaceHolder = 'Rechercher parmis vos commentaires ...';
    this.activeNav = 'reply';
    this.topicsSelected = 'selected scale-up-open';
    this.badgesSelected = '';
    this.roomsSelected = '';
    this.firstNavName = 'Commentaires';
    this.secondNavName = 'Topic';
  }

  loadMyRooms(searchToken?: string) {
    this.userService.getUserRooms(searchToken).subscribe(room => {
      if (!searchToken) {
        this.myRoomsInitial = room;
      }
      this.myRooms = room;


    });
  }

  loadMyCreatedRooms(searchToken?: string) {
    this.userService.getCreatedUserRooms(searchToken).subscribe(room => {
      if (!searchToken) {
        this.myCreatedRoomsInitial = room;
      }
      this.myCreatedRooms = room;

    });
  }

  loadMyTopics(searchToken?: string) {
    this.userService.getUserTopics(searchToken).subscribe(topic => {
      if (!searchToken) {
        this.myTopicsInitial = topic;
      }
      this.myTopics = topic;

    });
  }

  loadMyReplies(searchToken?: string) {
    this.userService.getUserReplies(searchToken).subscribe(reply => {
      if (!searchToken) {
        this.myRepliesInitial = reply;
      }
      this.myReplies = reply;

    });
  }

  loadMyStats() {
    this.userService.getUserStats().subscribe(stats => {
      this.loadedStats = stats;

    });
  }

  setTitle() {

    this.titleService.setTitle('Profile');
  }

  firstNav() {
    switch (this.firstNavName) {
      case 'Commentaires':
        this.setMyRepliesClass();
        break;
      case 'Mes groupes':
        this.setMyRoomsClass();
        break;
    }

  }


  secondNav() {
    this.firstNavChecked = false;
    switch (this.secondNavName) {
      case 'Topic':
        this.setMyTopicClass();
        break;
      case 'Groupes crées':
        this.setMyCreatedRoomClass();
        break;
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
      this.deletedReply = reply;
      setTimeout(() => {
        this.myReplies = this.myReplies.filter(r => r !== reply);
        this.myRepliesInitial = this.myRepliesInitial.filter(r => r !== reply);

      }, 500);
      // @ts-ignore
      $('#delete-modal').modal('toggle');
    });
  }

  deleteRoom(roomToDelete: Room) {
    this.roomService.deleteRoom(roomToDelete.id).subscribe(() => {
      this.deletedRoom = roomToDelete;
      console.log(roomToDelete);
      setTimeout(() => {
        this.filterDeletedRoom(roomToDelete);
      }, 500);
      // @ts-ignore
      $('#delete-modal').modal('toggle');
    });
  }

  filterDeletedRoom(roomToDelete: Room) {
    this.myRooms = this.myRooms.filter(r => r !== roomToDelete);
    this.myRoomsInitial = this.myRoomsInitial.filter(r => r !== roomToDelete);
    this.myCreatedRooms = this.myCreatedRooms.filter(r => r !== roomToDelete);
    this.myCreatedRoomsInitial = this.myCreatedRoomsInitial.filter(r => r !== roomToDelete);
  }

  deleteTopic(topic: Topic) {
    this.topicService.deleteTopic(topic.id).subscribe(() => {
      this.deletedTopic = topic;
      setTimeout(() => {
        this.myTopics = this.myTopics.filter(t => t !== topic);
        this.myTopicsInitial = this.myTopicsInitial.filter(t => t !== topic);
      }, 500);
      // @ts-ignore
      $('#delete-modal').modal('toggle');
      this.loadedStats.countTopics -= 1;
    });

  }

  searchBar(event) {
    const searchToken = event.target.value;
    switch (this.activeNav) {
      case 'reply':
        this.loadMyReplies(searchToken);
        break;
      case 'topic':
        this.loadMyTopics(searchToken);
        break;
      case 'myRooms':
        this.loadMyRooms(searchToken);
        break;
      case 'myCreatedRooms':
        this.loadMyCreatedRooms(searchToken);
        break;
    }


  }

  leavRoom(r: Room) {
    this.roomService.leavRoom(r.id).subscribe(() => {
      this.leftRoom = r;
      setTimeout(() => {
        this.myRooms = this.myRooms.filter(room => room.id !== r.id);
      }, 600);

    });
  }

  setMyRepliesClass() {
    this.searchInput.nativeElement.value = '';
    this.myReplies = this.myRepliesInitial;
    this.searchPlaceHolder = 'Rechercher parmis vos commentaires ...';
    this.myCommentsClass = 'event-item-table animated bounceInDown';
    this.myTopicsClass = 'd-none';
    this.activeNav = 'reply';
  }

  setMyTopicClass() {
    this.myTopics = this.myTopicsInitial;
    this.searchInput.nativeElement.value = '';
    this.searchPlaceHolder = 'Rechercher parmis vos topics ...';
    this.activeNav = 'topic';
    this.myTopicsClass = 'event-item-table animated bounceInDown';
    this.myCommentsClass = 'd-none';
  }

  setMyRoomsClass() {
    this.searchInput.nativeElement.value = '';
    this.searchPlaceHolder = 'Rechercher parmis vos groupes crées ...';
    this.activeNav = 'myRooms';
    this.myroomsClass = 'row fade-in';
    this.myCreatedRoomsClass = 'd-none';


  }

  setMyCreatedRoomClass() {
    this.searchInput.nativeElement.value = '';
    this.searchPlaceHolder = 'Rechercher parmis vos groupes de discussion ...';
    this.activeNav = 'myCreatedRooms';
    this.myCreatedRoomsClass = 'row fade-in';
    this.myroomsClass = 'd-none';


  }

  loadMyBadges() {
    this.userService.getUserBadges().subscribe(badges => {
      this.myBadges = badges;
    });
  }

  loadBadges() {
    this.badgeService.getAllBadges().subscribe(badges => {
      this.loadedBadges = badges;
    });

  }
}
