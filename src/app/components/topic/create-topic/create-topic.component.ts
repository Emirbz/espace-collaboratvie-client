import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import User from '../../../models/User';
import {TitleService} from '../../../services/title.service';
import Tag from '../../../models/Tag';
import {TagService} from '../../../services/tag.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TopicService} from '../../../services/topic.service';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-create-topic',
  templateUrl: './create-topic.component.html',
  styleUrls: ['./create-topic.component.css']
})
export class CreateTopicComponent implements OnInit {
  listOfOption = [];
  listOfTagOptions = [];
  selectedTags: any[] = [];
  loadedTags: Tag[];
  tagsSearching = false;
  topicFormGroup: FormGroup;
  loggedUser: User;
  toastSucces = 'alert alert-success d-none full-width';


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
    this.topicService.addTopic(dataTopic).subscribe(value => {
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
    this.toastSucces = 'alert alert-success full-width animated bounceInDown';
    setTimeout(() => {

      this.toastSucces = 'alert alert-success full-width animated bounceOutUp';
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


}
