import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import User from '../../../models/User';
import Topic from '../../../models/Topic';

@Component({
  selector: 'app-create-topic',
  templateUrl: './create-topic.component.html',
  styleUrls: ['./create-topic.component.css']
})
export class CreateTopicComponent implements OnInit {
  listOfOption = [];
  listOfTagOptions = [];
  dataReply: { reply: string, user: User, topic: Topic };

  constructor(private route: Router) {
  }

  ngOnInit() {
    const children = [];
    for (let i = 10; i < 36; i++) {
      children.push({label: i.toString(36) + i, value: i.toString(36) + i});
    }
    this.listOfOption = children;
  }

  createTopic() {
    this.route.navigate(['topic']);

  }

  changed(event) {
    console.log(event);
    this.listOfOption = [{label: 'set', value: 'set'}];

    console.log(this.listOfTagOptions);
    console.log(this.listOfOption);
  }
}
