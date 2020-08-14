import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {TopicService} from '../../../services/topic.service';
import Topic from '../../../models/Topic';
import {TitleService} from '../../../services/title.service';
import Tag from '../../../models/Tag';
import {TagService} from '../../../services/tag.service';
import {SearchService} from '../../../services/search.service';

@Component({
  selector: 'app-list-topics',
  templateUrl: './list-topics.component.html',
  styleUrls: ['./list-topics.component.css']
})
export class ListTopicsComponent implements OnInit {


  loadedTopics: Topic[];
  selectedTags: Tag[] = [];
  initialLoadedTopics: Topic[];
  loadedTags: Tag[];
  loadedPopularTags: Tag[];
  loadedPopularTopics: Topic[];
  tagsSearching = false;
  headerSearch: string;

  constructor(private topicService: TopicService,
              private titleService: TitleService,
              private tagService: TagService,
              private searchService: SearchService,
              private cdr: ChangeDetectorRef) {
  }


  ngOnInit() {
    this.loadTags();
    this.loadPouoularTags();
    this.setTitle();
    this.loadTopics([]);
    this.getSearchInput();
    this.loadPopularTopics();
  }

  loadTags() {
    this.tagService.getTags().subscribe(tags => {
      this.loadedTags = tags;
    });

  }

  getSearchInput() {
    this.searchService.getValue().subscribe(name => {
      this.headerSearch = name;
      this.topicService.getTopics(this.selectedTags, name).subscribe(topics => {
        this.loadedTopics = topics;
      });

    });
  }

  loadTopics(criteria, name?) {
    this.topicService.getTopics(criteria, name).subscribe(topics => {
      this.loadedTopics = topics;
      if (criteria.length === 0) {
        this.initialLoadedTopics = topics;
      }
      console.log(this.loadedTags);
    });
  }

  setTitle() {
    this.titleService.setTitle('Forum des experts');

  }


  onSearchTags(event: string) {
    this.tagsSearching = true;
    this.tagService.getTagsByName(event).subscribe(tags => {
      this.loadedTags = tags;
      this.tagsSearching = false;
    });
  }

  test() {
    console.log('raeza');
  }

  resetFilter() {
    this.selectedTags = [];
    this.loadedTopics = this.initialLoadedTopics;
  }

  addTag(tag: Tag) {
    this.selectedTags.push(tag);
    this.cdr.detectChanges();
  }

  loadPouoularTags() {
    this.tagService.getPopularTags().subscribe(tags => {
      this.loadedPopularTags = tags;
    });

  }

  loadPopularTopics() {
    this.topicService.getPopularTopics().subscribe(topics => {
      this.loadedPopularTopics = topics;
    });

  }
}
