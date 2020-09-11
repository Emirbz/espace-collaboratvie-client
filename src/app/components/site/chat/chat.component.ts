import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import {Duration, Icon, ToastBootsrapService} from '../../../services/toast-bootsrap.service';
import {Lightbox} from 'ngx-lightbox';
import {FileService} from '../../../services/file.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @ViewChild('msgInput', {static: false}) msgInput: ElementRef;
  @ViewChild('scrollMe', {static: true}) private myScrollContainer: ElementRef;
  /* -------- NgClasses ---------- */
  leftBarClass: string = 'col col-xl-3 order-xl-1 col-lg-3 order-lg-1 col-md-12 order-md-2 col-sm-12 col-12 responsive-display-none';
  rightBarClass: string = 'col col-xl-9 order-xl-2 col-lg-9 order-lg-2 col-md-12 order-md-1 col-sm-12 col-12';
  toastSuccess: string = 'alert alert-success d-none';
  jitsiClass: string = 'col col-xl-6 order-xl-3 col-lg-9 order-lg-2 col-md-12 order-md-1 col-sm-12 col-12';
  loaderClass: string = 'flexbox col col-xl-3 order-xl-3 col-lg-9 order-lg-2 col-md-12 order-md-1 col-sm-12 col-12 d-none';
  /* ------- Jitsi ------- */
  title: string = 'app';
  domain: string = 'meet.jit.si';
  options: any;
  apiJitsi: any;
  divJitsiHidden: boolean = true;
  videoCallHidden: boolean = false;
  jitsiFormGroup: FormGroup;
  connected: boolean = false;
  private eventBus: any;
  /* ------ Loaded Services -------- */
  loadedRoom: Room;
  loadedMessages: Message[] = [];
  loadedSondages: Message[] = [];
  loadedImages: Message[] = [];
  selectedMessage: Message;
  selectedUsers: User[] = [];
  loadedUsers: User[];
  loggedUser: User;
  /* -------- Post Data ------ */
  // tslint:disable-next-line:max-line-length
  bodyData: { body?: string, file?: string, room_id: number, user_id: string, type: string, message_id?: number, choix_id?: number };
  dataSondage: { body: string, type: string, user: User, room: Room, choix: Choix[] };
  dataReaction: { type: string, user: User, message: Message };
  sondageFormGroup: FormGroup;
  lastReactedId: string;
  /* ----- Loader ----- */
  messagesHasbeenLoaded = false;
  loaderHidden = true;
  sondagesHasBeenLoaded = false;
  allReactionChecked = false;
  /* ---- Photo upload --- */
  photoToUpload = false;
  photoChosen = false;
  presignedUrlForUpload: {};
  imageUplaodProgress: number = 0;
  imageUrl: any;
  albums: any = [];
  /*----- Invite Users ------ */
  usersFormGroup: FormGroup;
  selectedUsersToInvite: User[];
  uploadingFile: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private roomService: RoomService,
              private chatService: ChatService,
              private titleService: TitleService,
              private userService: UserService,
              private router: Router,
              private toastBootstrapService: ToastBootsrapService,
              private lightBox: Lightbox,
              private fileService: FileService
  ) {
  }

  open(index: number): void {
    console.log(index);

    this.lightBox.open(this.albums, index);
  }

  close(): void {
    // close lightbox programmatically
    this.lightBox.close();
  }

  ngOnInit() {
    this.getLoggedUser();
    this.joinRoom();
    this.jitsiFormValidate();
    this.loadRoomMessages();
    this.loadUsersToInvite();
    this.usersFormGroupValidate();
    this.loadRoomSondages();
    this.connectToChat();
    this.SondageFormValidate();


  }


  loadUsersToInvite() {
    const id = this.route.snapshot.paramMap.get('id');
    this.userService.getUsersToInvite(id).subscribe(u => {
      this.loadedUsers = u;
    });

  }

  inviteUsers() {
    const id = this.route.snapshot.paramMap.get('id');
    const usersToPersist: User[] = [];
    this.usersFormGroup.value.users.forEach(idUser => {
      const u = new User(idUser, null, null, null);
      usersToPersist.push(u);
    });

    this.roomService.addUsers(id, usersToPersist).subscribe(() => {
      this.usersFormGroup.reset();
      this.loadRoom();
      this.loadUsersToInvite();
      // @ts-ignore
      $('#modal-invite-users').modal('toggle');
      // tslint:disable-next-line:max-line-length
      this.showToast('Collaborateurs ajouté', 'Les collaborateurs ont été ajouté à votre groupe de discussion', Icon.success, undefined, Duration.long);
    });


  }

  usersFormGroupValidate() {
    /*----TODO on refresh select css broken ------ */
    this.usersFormGroup = this.formBuilder.group({
      users: [this.loadedUsers, Validators.required]
    });


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
    }, error => {
      if (error.status === 404) {
        this.router.navigate(['/rooms']);
      }
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
      if (!room.users.some(item => item.id === this.loggedUser.id)) {
        this.router.navigate(['rooms']);
      }
      // this.loadUsers(room);
    });
  }

  loadRoomMessages() {
    this.loadedMessages = [];
    const id = this.route.snapshot.paramMap.get('id');
    this.chatService.getMessageByRoom(id).subscribe(msg => {
      this.loadRoomImages(msg);
      this.loadedMessages = msg;
      this.messagesHasbeenLoaded = true;
      if (msg.length > 0) {
        this.scrollToElement('message' + msg[msg.length - 1].id, 'auto', 0);
      }
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
          el.scrollIntoView({behavior: 'auto', block: 'end'});
          break;
      }
    }, time);


  }

  loadRoomSondages() {
    this.loadedSondages = [];
    const id = this.route.snapshot.paramMap.get('id');
    this.chatService.getSondagesByRoom(id).subscribe(msg => {
      this.sondagesHasBeenLoaded = true;
      this.loadedSondages = msg;

    });
  }

  checkReactionsExists(m: Message, type: string): boolean {
    return m.reactions.some(item => item.type.includes(type));
  }

  openModalReaction(m: Message) {
    this.allReactionChecked = true;
    this.selectedMessage = m;

  }

  loadReactionsByType(type: string): Reaction[] {

    if (this.selectedMessage) {
      return this.selectedMessage.reactions.filter(r => r.type === type);
    }
    return [];
  }

  loadRoomImages(msg: Message[]) {
    msg.forEach(m => {
      if (m.type === 'IMAGE') {
        this.pushImageToAlbum(m);
        this.loadedImages.unshift(m);
      }
    });
  }

  pushImageToAlbum(m: Message, position?: string) {
    const src = m.metaData.presignedUrl;
    const caption = m.metaData.objectId;
    const album = {
      src,
      caption
    };
    if (position === 'FIRST') {

      this.albums.unshift(album);
      this.loadedImages.unshift(m);

    } else {

      this.albums.push(album);
    }

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
    this.eventBus = new EventBus(environment.apis.eventBus + id);
    this.eventBus.enableReconnect(true);
    this.eventBus.onopen = () => {
      console.log('------ Connected to the web socket Room id = ' + id + ' ----');
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
      case 'REACTION'  :
        const reaction = JSON.parse(body.body) as Reaction;
        this.appendReaction(reaction, body.message_id);
        break;
      case 'TEXT':
      case 'VIDEO':
      case  'IMAGE' :
      case 'AUDIO' :
      case 'FILE' :
        const recivedText = JSON.parse(body.body) as Message;
        this.appendText(recivedText);
        break;

      case 'SONDAGE':
        const recivedSondage = JSON.parse(body.body) as Message;
        this.appendSondage(recivedSondage);

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
    console.log(type);
    console.log(value);

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
      case 'VIDEO':
      case  'IMAGE' :
      case 'AUDIO' :
      case 'FILE' :
        this.bodyData.file = value;
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
    this.publishMessage('SONDAGE', null, null, this.dataSondage);
    this.sondageFormGroup.reset();
    // @ts-ignore
    $('#modal-add-sondage').modal('toggle');


  }

  showToast(title: string, description: string, icon?: Icon, timestamp?: string, duration?: Duration) {
    const id = Date.now();
    this.toastBootstrapService.show(id, title, description, {
      timestamp,
      icon,
      duration
    });
  }

  vote(id: number, message?: Message) {
    console.log(id);
    this.publishMessage('VOTE', null, message, null, id);

  }


  checkUserReacted(m: Message, u: User) {
    return m.reactions.some(item => item.user.id === u.id);
  }

  react(message: Message, type: string) {
    this.dataReaction = {type, message, user: this.loggedUser};
    this.publishMessage('REACTION', type, message, null);

  }

  checkUserHasVoted(c: Choix, user?: User) {
    return c.users.some(item => item.id === user.id);
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

  resetAllReaction() {
    this.allReactionChecked = false;

  }

  private appendText(recivedMessage: Message) {
    recivedMessage.reactions = [];
    if (recivedMessage.type === 'IMAGE') {
      this.pushImageToAlbum(recivedMessage, 'FIRST');
    }
    this.loadedMessages.push(recivedMessage);
    this.scrollToElement('message' + recivedMessage.id, 'smooth', 50);
  }

  private appendSondage(recivedSondage: Message) {
    if (recivedSondage.user.id === this.loggedUser.id) {
      this.showToast('Sondage crée', 'Votre sondage a été envoyée au discussion avec sucésss', Icon.success, undefined, Duration.long);
    }
    this.loadedMessages.push(recivedSondage);
    this.loadedSondages.splice(0, 0, recivedSondage);
    this.scrollToElement('message' + recivedSondage.id, 'smooth', 500);
  }

  openModalUploadImages() {
    this.photoToUpload = false;
    this.photoChosen = false;
    this.presignedUrlForUpload = {};
    this.imageUplaodProgress = 0;
    this.uploadingFile = false;

  }


  getPresignedUrlForUpload(event) {
    console.log(event.target.files[0].type);
    this.uploadingFile = false;
    this.imageUplaodProgress = 0;
    this.displayImageToUpload(event);
    this.photoChosen = true;
    setTimeout(() => {
      this.photoToUpload = true;
    }, 100);
    this.fileService.getPresignedUrlForUpload(event.target.files[0]).subscribe(upload => {
      this.presignedUrlForUpload = upload;
    });
  }

  displayImageToUpload(event) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      this.imageUrl = reader.result;
    };
  }

  uploadPhoto(files: FileList) {
    this.uploadingFile = true;
    this.fileService.upload(files[0], true, this.presignedUrlForUpload).subscribe(value => {
      if (value !== undefined) {
        if (!isNaN(value)) {
          this.imageUplaodProgress = value;
        } else if (value instanceof Array) {
          console.log('id: ' + value[0].id);
          // @ts-ignore
          $('#modal-uplaod-photo').modal('toggle');
          this.publishMessage(this.getFileType(files[0]), value[0].id);
          this.uploadingFile = false;

        }
      }
    });

  }

  getFileType(file: File): string {
    // tslint:disable-next-line:max-line-length
    return file.type.indexOf('image') > -1 ? 'IMAGE' : file.type.indexOf('audio') > -1 ? 'AUDIO' : file.type.indexOf('video') > -1 ? 'VIDEO' : 'FILE';
  }


  getLinkPreview(msg: Message) {


    this.chatService.getLinkPreview(msg.body).subscribe(value => {
      msg.linkPreview = value;
    }, () => {
      msg.linkPreview = undefined;
    });
  }


  imageIndex(objectId: string) {
    return this.albums.findIndex(album => album.caption === objectId);
  }


  public loadScript(url) {
    const node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    document.getElementsByTagName('body')[0].appendChild(node);


  }


}
