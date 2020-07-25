import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as JitsiMeetExternalAPI from '../../../../assets/js/Jitsi/external_api';
import {FormBuilder, FormGroup} from '@angular/forms';
import Room from '../../../models/Room';
import Message from '../../../models/Message';
import {ActivatedRoute} from '@angular/router';
import {RoomService} from '../../../services/room.service';
import {ChatService} from '../../../services/chat.service';
import Reaction from '../../../models/Reaction';
import Choix from '../../../models/Choix';
import {TitleService} from '../../../services/title.service';
import User from '../../../models/User';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {
  @ViewChild('msgInput', {static: false}) msgInput: ElementRef;
  loaderHidden = true;
  leftBarClass = 'col col-xl-3 order-xl-1 col-lg-3 order-lg-1 col-md-12 order-md-2 col-sm-12 col-12 responsive-display-none';
  rightBarClass = 'col col-xl-9 order-xl-2 col-lg-9 order-lg-2 col-md-12 order-md-1 col-sm-12 col-12';
  contrainerClass = 'container';
  title = 'app';
  domain = 'meet.jit.si';
  options: any;
  apiJitsi: any;
  divJitsiHidden = true;
  jitsiClass = 'col col-xl-6 order-xl-3 col-lg-9 order-lg-2 col-md-12 order-md-1 col-sm-12 col-12';
  loaderClass = 'flexbox col col-xl-3 order-xl-3 col-lg-9 order-lg-2 col-md-12 order-md-1 col-sm-12 col-12 d-none';

  videoCallHidden = false;
  jitsiFormGroup: FormGroup;
  loadedRoom: Room;
  loadedMessages: Message[] = [];
  loadedSondages: Message[] = [];
  loadedImages: Message[] = [];
  staticUserId = '760aa2ed-f45a-4696-bb9a-f23989a9b0a0';
  selectedMessage: Message;
  selectedUsers: User[] = [];
  messagesHasbeenLoaded = false;
  allReactioxnsChecked: true;


  ngAfterViewInit() {
  }

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private roomService: RoomService,
              private chatService: ChatService,
              private titleService: TitleService
  ) {

  }

  ngOnInit() {
    this.loadRoom();

    this.loadScript('assets/js/main.js');
    this.loadScript('assets/js/libs-init/libs-init.js');
    this.jitsiFormValidate();
    this.loadRoomMessages();
    this.loadRoomSondages();

  }

  public loadScript(url) {
    const node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);


  }

  setTitle() {
    if (this.loadedRoom) {
      this.titleService.setTitle(this.loadedRoom.name);
    }
  }

  jitsiFormValidate() {
    this.jitsiFormGroup = this.formBuilder.group({
      video: [false],
      micro: [false]
    });

  }

  openJitsi() {
    this.options = {
      roomName: 'JitsiMeetAPIExampleX',
      width: 1050,
      height: 770,
      parentNode: document.querySelector('#jitsi')
    };
    // @ts-ignore
    $('#modal-jitsi').modal('toggle');
    this.apiJitsi = new JitsiMeetExternalAPI(this.domain, this.options);

    if (!this.jitsiFormGroup.value.video) {
      this.apiJitsi.executeCommand('toggleVideo');
    }
    if (!this.jitsiFormGroup.value.micro) {
      this.apiJitsi.executeCommand('toggleAudio');
    }
    this.apiJitsi.addEventListener('videoConferenceJoined', () => {
      this.loaderClass = 'flexbox col col-xl-3 order-xl-3 col-lg-9 order-lg-2 col-md-12 order-md-1 col-sm-12 col-12 animated bounceOutUp';
      setTimeout(() => {
        this.divJitsiHidden = false;
        // this.loaderHidden = true;
      }, 500);
    });
    this.apiJitsi.addEventListener('videoConferenceLeft', () => {
      this.divJitsiHidden = true;
      this.changeClassesJitsi('LEFT');
      this.apiJitsi.executeCommand('hangup');
      document.querySelector('#jitsi').innerHTML = '';

    });
    setTimeout(() => {
      this.changeClassesJitsi('JOIN');
    }, 300);


  }


  changeClassesJitsi(type: string) {
    if (type === 'JOIN') {
      this.videoCallHidden = true;
      this.leftBarClass += ' animated bounceOutUp';
      setTimeout(() => {
        this.rightBarClass = 'col col-xl-6 order-xl-2 col-lg-9 order-lg-2 col-md-12 order-md-1 col-sm-12 col-12 margin-540';
        setTimeout(() => {
          // tslint:disable-next-line:max-line-length
            this.loaderClass += 'flexbox col col-xl-3 order-xl-3 col-lg-9 order-lg-2 col-md-12 order-md-1 col-sm-12 col-12 animated bounceInDown';
          //  this.loaderHidden = false;
          }, 600
        );
      }, 300);
    } else if (type === 'LEFT') {
      this.rightBarClass = 'col col-xl-9 order-xl-2 col-lg-9 order-lg-2 col-md-12 order-md-1 col-sm-12 col-12';
      setTimeout(() => {
        // tslint:disable-next-line:max-line-length
        this.leftBarClass = 'col col-xl-3 order-xl-1 col-lg-3 order-lg-1 col-md-12 order-md-2 col-sm-12 col-12 responsive-display-none animated bounceInDown';
        this.videoCallHidden = false;
      }, 500);

    }


  }


  loadRoom() {
    const id = this.route.snapshot.paramMap.get('id');
    this.roomService.getRoom(id).subscribe(room => {
      this.loadedRoom = room;
      this.setTitle();
    });
  }

  loadRoomMessages() {
    const id = this.route.snapshot.paramMap.get('id');
    this.chatService.getMessageByRoom(id).subscribe(msg => {
      this.loadedMessages = msg;
      this.messagesHasbeenLoaded = true;

    });
  }

  loadRoomSondages() {
    const id = this.route.snapshot.paramMap.get('id');
    this.chatService.getSondagesByRoom(id).subscribe(msg => {
      this.loadedSondages = msg;


    });
  }

  checkReactionsExists(m: Message, type: string): boolean {
    return m.reactions.some(item => item.type.includes(type));
  }

  openModalReaction(m: Message) {
    this.selectedMessage = m;

  }

  loadReactionsByType(type: string): Reaction[] {

    if (this.selectedMessage) {
      return this.selectedMessage.reactions.filter(r => r.type === type);
    }
    return [];
  }

  loadRoomImages() {
    const id = this.route.snapshot.paramMap.get('id');
    this.chatService.getImagesByRoom(id).subscribe(images => {
      this.loadedImages = images;
    });
  }


  calculateUsersVote(c: Choix, message: Message): number {
    let totalUsers = 0;
    const choiceUsers = c.users.length;
    message.choix.forEach(choice => {
      totalUsers += choice.users.length;
    });
    if (totalUsers > 0) {
      return (choiceUsers / totalUsers) * 100;
    }
    return 0;
  }

  openModalAllUsers(users: User[]) {
    this.selectedUsers = users;
  }
}
