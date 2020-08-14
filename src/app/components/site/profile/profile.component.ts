import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../../services/user.service';
import User from '../../../models/User';
import {TitleService} from '../../../services/title.service';
import Room from '../../../models/Room';
import Topic from '../../../models/Topic';
import Reply from '../../../models/Reply';
import UserStats from '../../../models/userStats';
import {ReplyService} from '../../../services/reply.service';
import {TopicService} from '../../../services/topic.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit {
  @ViewChild('searchInput', {static: false}) searchInput: ElementRef;
  loggedUser: User;
  topicsClass = 'd-none';
  searchPlaceHolder = 'Rechercher parmis vos groupes de discussion ...';
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
  myTopicsInitial: Topic[];
  myRepliesInitial: Reply[];
  myStats: UserStats;
  itemToDelete: string;
  replyToDelete: Reply;
  topicToDelete: Topic;
  roomToDelete: Room;
  deletedReply: Reply;
  deletedTopic: Topic;
  deletedRoom: Room;
  activeNav: string;

  constructor(
    private  userService: UserService,
    private titleService: TitleService,
    private replyService: ReplyService,
    private topicService: TopicService
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
    this.setRoomClasses();
  }

  setRoomClasses() {
    this.searchInput.nativeElement.value = '';

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
    this.setTopicClasses();

  }

  setTopicClasses() {
    this.myTopics = this.myTopicsInitial;
    this.myReplies = this.myRepliesInitial;
    this.searchInput.nativeElement.value = '';
    this.topicsClass = 'ui-block fade-in';
    this.roomsClass = 'd-none';
    this.searchPlaceHolder = 'Rechercher parmis vos commentaires ...';
    this.activeNav = 'reply';
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
      this.myTopicsInitial = topic;

    });
  }

  loadMyReplies() {
    this.userService.getUserReplies().subscribe(reply => {
      this.myReplies = reply;
      this.myRepliesInitial = reply;

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
      this.searchInput.nativeElement.value = '';
      this.myReplies = this.myRepliesInitial;
      this.searchPlaceHolder = 'Rechercher parmis vos commentaires ...';
      this.myCommentsClass = 'event-item-table animated bounceInDown';
      this.myTopicsClass = 'd-none';
      this.activeNav = 'reply';
    }

  }


  secondNav() {
    if (this.secondNavName === 'Topic') {
      this.myTopics = this.myTopicsInitial;
      this.searchInput.nativeElement.value = '';
      this.searchPlaceHolder = 'Rechercher parmis vos topics ...';
      this.activeNav = 'topic';
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
      this.deletedReply = reply;
      setTimeout(() => {
        this.myReplies = this.myReplies.filter(r => r !== reply);

      }, 500);
      // @ts-ignore
      $('#delete-modal').modal('toggle');
      this.myStats.countReplies -= 1;
    });
  }

  deleteRoom(roomToDelete: Room) {
    // TODO add user to room attributes to delete room
  }

  deleteTopic(topic: Topic) {
    this.topicService.deleteTopic(topic.id).subscribe(() => {
      this.deletedTopic = topic;
      setTimeout(() => {
        this.myTopics = this.myTopics.filter(t => t !== topic);
      }, 500);
      // @ts-ignore
      $('#delete-modal').modal('toggle');
      this.myStats.countTopics -= 1;
    });

  }

  searchBar(event) {
    console.log(event.target.value);
    if (this.activeNav === 'reply') {
      this.userService.getUserReplies(event.target.value).subscribe(reply => {
        this.myReplies = reply;
      });
    } else if (this.activeNav === 'topic') {
      this.userService.getUserTopics(event.target.value).subscribe(topics => {
        this.myTopics = topics;
      });
    }


  }
}
