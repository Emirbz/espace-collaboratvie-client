import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import Topic from '../../../models/Topic';
import Reply from '../../../models/Reply';
import {ReplyService} from '../../../services/reply.service';
import {TopicService} from '../../../services/topic.service';
import {UserService} from '../../../services/user.service';
import User from '../../../models/User';
import AOS from 'aos';
import {TitleService} from '../../../services/title.service';

@Component({
  selector: 'app-details-topic',
  templateUrl: './details-topic.component.html',
  styleUrls: ['./details-topic.component.css']
})
export class DetailsTopicComponent implements OnInit, AfterViewInit {
  @ViewChild('commentInput', {static: false}) commentInput: ElementRef;

  loadedTopic: Topic;
  loadedReplies: Reply[];
  loggedUser: User;
  dataReply: { reply: string, user: User, topic: Topic };
  lastCommentId: string;
  pageOfItems: Reply[];
  nbrLikes = 9;
  lastLikedId: string;


  constructor(private route: ActivatedRoute,
              private replyService: ReplyService,
              private topicService: TopicService,
              private userService: UserService,
              private renderer: Renderer2,
              private titleService: TitleService) {
  }

  ngOnInit() {
    this.loadsigneTopic();
    this.loadReplies();
    this.getLoggedUser();
    AOS.init();
  }

  ngAfterViewInit() {

  }

  setTitle(title: string) {

    this.titleService.setTitle(title);
  }


  public loadScript(url) {
    const node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);


  }

  loadsigneTopic() {
    const id = this.route.snapshot.paramMap.get('id');
    this.topicService.getTopic(id).subscribe(topic => {
      this.loadedTopic = topic;
      this.setTitle(topic.title);
    });
  }

  loadReplies() {
    const id = this.route.snapshot.paramMap.get('id');

    this.replyService.getReplies(id).subscribe(replies => {
      this.loadedReplies = replies;

    });

  }

  getLoggedUser() {
    this.userService.getUser().subscribe(user => {
      this.loggedUser = user;
    });
  }


  postComment(reply: string) {
    this.dataReply = {reply, user: this.loggedUser, topic: this.loadedTopic};
    this.replyService.addReply(this.dataReply).subscribe(r => {
      this.loadedReplies.splice(0, 0, r);
      console.log(this.loadedReplies);
      this.loadedTopic.countReplies += 1;
      this.commentInput.nativeElement.value = '';
      this.lastCommentId = 'comment' + r.id;
      setTimeout(() => {
        this.scrollToElement('comment' + r.id);
      }, 200);

    });

  }

  scrollToElement(elementSelector: string) {
    const el = document.getElementById(elementSelector);
    el.scrollIntoView({behavior: 'smooth', block: 'center'});
  }

  onChangePage(pageOfItems: Reply[]) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }

  reactReply(id: number) {
    this.replyService.likeReply(id).subscribe(reply => {
      const index = this.loadedReplies.findIndex(r => r.id === id);
      this.loadedReplies[index].users = reply.users;
    });
  }

  checkUserLiked(r: Reply, u: User) {
    return r.users.some(item => item.id === u.id);
  }

}
