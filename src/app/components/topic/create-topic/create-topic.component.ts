import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import User from '../../../models/User';
import {TitleService} from '../../../services/title.service';
import Tag from '../../../models/Tag';
import {TagService} from '../../../services/tag.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TopicService} from '../../../services/topic.service';
import {UserService} from '../../../services/user.service';
import Topic from '../../../models/Topic';

@Component({
  selector: 'app-create-topic',
  templateUrl: './create-topic.component.html',
  styleUrls: ['./create-topic.component.css']
})
export class CreateTopicComponent implements OnInit {

  selectedTags: any[] = [];
  loadedTags: Tag[];
  tagsSearching: boolean = false;
  topicFormGroup: FormGroup;
  loggedUser: User;
  toastSuccess: string = 'alert alert-success d-none full-width';
  loadedPopularTopics: Topic[];
  recentTopics: Topic[];


  constructor(private route: Router,
              private titleService: TitleService,
              private tagService: TagService,
              private topicService: TopicService,
              private formBuilder: FormBuilder,
              private userService: UserService
  ) {
  }

  ngOnInit() {
    this.setTitle();
    this.loadTags();
    this.topicFormValidate();
    this.getLoggedUser();
    this.loadPopularTopics();
    this.loadRecentTopics();


  }

  getLoggedUser() {
    this.userService.getUser().subscribe(user => {
      this.loggedUser = user;
    });
  }

  setTitle() {

    this.titleService.setTitle('Nouveau topic');

  }

  createTopic() {
    this.reformSelectedTag();
    const {title, description} = this.topicFormGroup.value;
    const dataTopic = {title, description, tags: this.selectedTags, user: this.loggedUser};
    this.topicService.addTopic(dataTopic).subscribe(() => {
      this.showSucces();
    });
  }

  reformSelectedTag() {
    this.selectedTags.forEach((value, index) => {
      if (value.id !== undefined) {
        return;
      }
      const tag = new Tag();
      tag.name = value;
      this.selectedTags[index] = tag;
    });
  }

  showSucces() {
    this.toastSuccess = 'alert alert-success full-width animated bounceInDown';
    setTimeout(() => {

      this.toastSuccess = 'alert alert-success full-width animated bounceOutUp';
      setTimeout(() => {
        this.route.navigate(['/topic']);
      }, 400);
    }, 1500);


  }


  loadTags() {
    this.tagService.getTags().subscribe(tags => {
      this.loadedTags = tags;
    });

  }

  onSearchTags(event: string) {
    this.tagsSearching = true;
    this.tagService.getTagsByName(event).subscribe(tags => {
      this.loadedTags = tags;
      this.tagsSearching = false;
    });
  }

  topicFormValidate() {
    this.topicFormGroup = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      tags: ['', Validators.required],
    });

  }


  loadPopularTopics() {
    this.topicService.getPopularTopics().subscribe(topics => {
      this.loadedPopularTopics = topics;
    });
  }

  loadRecentTopics() {
    this.topicService.getTopics([]).subscribe(topics => {
      this.recentTopics = topics;

    });


  }
}
