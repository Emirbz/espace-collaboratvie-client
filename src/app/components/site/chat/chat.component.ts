import {AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as JitsiMeetExternalAPI from '../../../../assets/js/Jitsi/external_api';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import Room from '../../../models/Room';
import Message from '../../../models/Message';
import {ActivatedRoute, Router} from '@angular/router';
import {RoomService} from '../../../services/room.service';
import {ChatService} from '../../../services/chat.service';
import Reaction from '../../../models/Reaction';
import Choix from '../../../models/Choix';
import {TitleService} from '../../../services/title.service';
import User from '../../../models/User';
import {UserService} from '../../../services/user.service';
import {environment} from '../../../../environments/environment';
import * as EventBus from 'vertx3-eventbus-client';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('msgInput', {static: false}) msgInput: ElementRef;
  @ViewChild('scrollMe', {static: true}) private myScrollContainer: ElementRef;
  loaderHidden = true;
  leftBarClass = 'col col-xl-3 order-xl-1 col-lg-3 order-lg-1 col-md-12 order-md-2 col-sm-12 col-12 responsive-display-none';
  rightBarClass = 'col col-xl-9 order-xl-2 col-lg-9 order-lg-2 col-md-12 order-md-1 col-sm-12 col-12';
  toastSucces = 'alert alert-success d-none';
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
  selectedMessage: Message;
  selectedUsers: User[] = [];
  messagesHasbeenLoaded = false;
  loggedUser: User;
  connected = false;
  private eventBus;
  // tslint:disable-next-line:max-line-length
  bodyData: { body?: string, file?: string, room_id: number, user_id: string, type: string, message_id?: number, choix_id?: number };
  dataSondage: { body: string, type: string, user: User, room: Room, choix: Choix[] };
  dataReaction: { type: string, user: User, message: Message };
  sondageFormGroup: FormGroup;
  lastReactedId: string;


  ngAfterViewInit() {


  }


  ngAfterViewChecked() {

  }

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private roomService: RoomService,
              private chatService: ChatService,
              private titleService: TitleService,
              private userService: UserService,
              private router: Router,
  ) {


  }

  ngOnInit() {
    this.joinRoom();

    this.getLoggedUser();
    this.jitsiFormValidate();
    this.loadRoomMessages();
    this.loadRoomSondages();
    this.connectToChat();
    this.SondageFormValidate();

    // @ts-ignore


  }

  getLoggedUser() {
    this.userService.getUser().subscribe(user => {
      this.loggedUser = user;
    });
  }

  joinRoom() {
    const id = this.route.snapshot.paramMap.get('id');
    this.roomService.joinRoom(id).subscribe(() => {
      this.loadRoom();
    });
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
      roomName: this.loadedRoom.name,
      width: 1050,
      height: 770,
      parentNode: document.querySelector('#jitsi')
    };
    this.loaderHidden = false;
    // @ts-ignore
    $('#modal-jitsi').modal('toggle');
    this.apiJitsi = new JitsiMeetExternalAPI(this.domain, this.options);

    if (!this.jitsiFormGroup.value.video) {
      this.apiJitsi.executeCommand('toggleVideo');
    }
    if (!this.jitsiFormGroup.value.micro) {
      this.apiJitsi.executeCommand('toggleAudio');
    }
    this.apiJitsi.executeCommand('avatarUrl', this.loggedUser.image);
    this.apiJitsi.addEventListener('videoConferenceJoined', () => {
      this.loaderClass = 'flexbox col col-xl-3 order-xl-3 col-lg-9 order-lg-2 col-md-12 order-md-1 col-sm-12 col-12 animated bounceOutUp';
      setTimeout(() => {
        this.divJitsiHidden = false;
        this.loaderHidden = true;
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
    this.loadedMessages = [];
    const id = this.route.snapshot.paramMap.get('id');
    this.chatService.getMessageByRoom(id).subscribe(msg => {
      this.loadedMessages = msg;
      this.messagesHasbeenLoaded = true;
      this.scrollToElement('message' + msg[msg.length - 1].id, 'auto', 0);

    });
  }

  scrollToElement(elementSelector: string, behavior: string, time: number) {
    setTimeout(() => {
      const el = document.getElementById(elementSelector);
      switch (behavior) {
        case 'smooth':
          el.scrollIntoView({behavior: 'smooth', block: 'center'});
          break;
        case 'auto':
          el.scrollIntoView({behavior: 'auto', block: 'center'});
          break;
      }
    }, time);


  }

  loadRoomSondages() {
    this.loadedSondages = [];
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

  connectToChat() {
    const id = this.route.snapshot.paramMap.get('id');
    const self = this;
    if (this.connected) {
      return;
    }
    console.log('status = connected ');
    this.eventBus = new EventBus(environment.apis.eventBus + id);
    this.eventBus.enableReconnect(true);
    this.eventBus.onopen = () => {
      console.log('Connected to the web socket Room id = ' + id);
      self.connected = true;
      self.eventBus.registerHandler('chat.to.client/' + id, (error, message) => {
        try {
          self.appendMessage(message.body);
        } catch (e) {
          console.log(e);
        }
      });
    };
  }

  appendMessage(body: any) {
    switch (body.type) {
      case 'REACTION':
        const reaction = JSON.parse(body.body) as Reaction;
        console.log(reaction);
        this.appendReaction(reaction, body.message_id);
        break;
      case 'TEXT':
        const recivedMessage = JSON.parse(body.body) as Message;
        recivedMessage.reactions = [];
        this.loadedMessages.push(recivedMessage);
        this.scrollToElement('message' + recivedMessage.id, 'smooth', 50);
        break;
      case 'SONDAGE':
        const recivedSondage = JSON.parse(body.body) as Message;
        this.loadedMessages.push(recivedSondage);
        this.loadedSondages.splice(0, 0, recivedSondage);
        this.scrollToElement('message' + recivedSondage.id, 'smooth', 50);

        break;
      case 'VOTE':
        const user = JSON.parse(body.user) as User;
        this.appendVote(this.loadedSondages, body.choix_id, user, body.message_id);
        this.appendVote(this.loadedMessages, body.choix_id, user, body.message_id);
        break;
    }

  }

  appendReaction(reaction: Reaction, messageId: any) {
    this.lastReactedId = 'reaction' + messageId;
    const reactedMessage = this.loadedMessages.find(message => message.id === messageId);
    if (this.checkUserReacted(reactedMessage, reaction.user)) {
      this.removeOldReaction(reactedMessage, reaction.user);
    }
    reactedMessage.reactions.push(reaction);
    setTimeout(() => {
      this.lastReactedId = '';
    }, 900);
  }

  removeOldReaction(votedMessage: Message, user: User) {
    const oldReaction: Reaction = votedMessage.reactions.find(r => r.user.id === user.id);
    const i = votedMessage.reactions.indexOf(oldReaction);
    votedMessage.reactions.splice(i, 1);

  }


  sendMessage(value: string) {
    if (value === '') {
      return;
    }
    this.msgInput.nativeElement.value = '';
    this.publishMessage('TEXT', value, null, null);
  }

  publishMessage(type: string, value?: string, message?: Message, sondage?: any, choixId?: number) {

    this.bodyData = {
      room_id: this.loadedRoom.id,
      user_id: this.loggedUser.id,
      type
    };
    switch (type) {
      case 'REACTION':
        this.bodyData.message_id = message.id;
        this.bodyData.body = value;
        break;
      case 'TEXT':
        this.bodyData.body = value;
        break;
      case 'SONDAGE':
        this.bodyData.body = JSON.stringify(sondage);
        break;
      case 'VOTE':
        this.bodyData.choix_id = choixId;
        this.bodyData.message_id = message.id;
        break;
    }
    this.eventBus.send('chat.to.server', JSON.stringify(this.bodyData));

  }

  SondageFormValidate() {
    this.sondageFormGroup = this.formBuilder.group({
      question: ['', [Validators.required]],
      choix: this.formBuilder.array([
        this.initFormArrayOptions()
      ])
    });

  }

  initFormArrayOptions() {
    return this.formBuilder.group({
      body: ['', [Validators.required]]
    });
  }

  addOption() {
    const control = this.sondageFormGroup.controls.choix as FormArray;
    control.push(this.initFormArrayOptions());
  }

  removeOption(i: number) {
    const control = this.sondageFormGroup.controls.choix as FormArray;
    control.removeAt(i);
  }

  sondageOptions(): FormArray {
    return this.sondageFormGroup.get('choix') as FormArray;
  }

  postSondage() {
    const {question, choix} = this.sondageFormGroup.value;
    this.dataSondage = {body: question, choix, room: new Room(this.loadedRoom.id), type: 'SONDAGE', user: this.loggedUser};

    this.showSucces();

    this.publishMessage('SONDAGE', null, null, this.dataSondage);


  }

  showSucces() {
    this.toastSucces = 'alert alert-success animated bounceInDown';
    setTimeout(() => {

      this.toastSucces = 'alert alert-success animated bounceOutUp';
      setTimeout(() => {
        // @ts-ignore
        $('#modal-add-sondage').modal('toggle');
        this.toastSucces = 'alert alert-succes d-none';
      }, 400);
    }, 1500);


  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {
    }
  }

  vote(id: number, message?: Message) {
    console.log(id);
    this.publishMessage('VOTE', null, message, null, id);

  }

  checkUserHasVoted(c: Choix, user?: User) {
    return c.users.some(item => item.id === user.id);
  }

  checkUserReacted(m: Message, u: User) {
    return m.reactions.some(item => item.user.id === u.id);
  }

  react(message: Message, type: string) {
    this.dataReaction = {type, message, user: this.loggedUser};
    this.publishMessage('REACTION', type, message, null);

  }

  private appendVote(sondageArray: Message[], choixId: number, user: User, messageId: any) {
    const sondage = sondageArray.find(s => s.id === messageId);
    sondage.choix.forEach(c => {
      if (this.checkUserHasVoted(c, user)) {
        this.removeOldVote(c, user);
      }
      if (c.id === choixId) {
        c.users.push(user);
      }
    });
  }

  private removeOldVote(c: Choix, user: User) {
    c.users.forEach((u, index) => {
      if (u.id === user.id) {
        c.users.splice(index, 1);
      }
    });

  }

  leavRoom() {
    const id = this.route.snapshot.paramMap.get('id');
    this.roomService.leavRoom(id).subscribe(() => {
      this.router.navigate(['rooms']);

    });
  }
}
