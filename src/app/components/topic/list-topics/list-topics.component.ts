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
  recentTopics: Topic[];
  selectedTags: Tag[] = [];
  initialLoadedTopics: Topic[];
  loadedTags: Tag[];
  tagsSearching = false;
  searchValue: string;

  constructor(private topicService: TopicService,
              private titleService: TitleService,
              private tagService: TagService,
              private searchService: SearchService,
              private cdr: ChangeDetectorRef) {
  }


  ngOnInit() {
    this.loadTags();
    this.setTitle();
    this.loadTopics([]);
    // this.getSearchInput();
  }

  loadTags() {
    this.tagService.getTags().subscribe(tags => {
      this.loadedTags = tags;
    });

  }

  getSearchInput() {
    this.searchService.getValue().subscribe(appTitle => {

      try {
        this.searchValue = appTitle;
        console.log(this.searchValue);
        this.loadedTopics = this.loadedTopics.filter(value => value.title.toLowerCase().match(appTitle.toLowerCase()));

      } catch (e) {
        console.log(e);
      }
    });
  }

  loadTopics(criteria) {
    this.topicService.getTopics(criteria).subscribe(topics => {
      this.loadedTopics = topics;
      if (criteria.length === 0) {
        this.recentTopics = topics;
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
}
