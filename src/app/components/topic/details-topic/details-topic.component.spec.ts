import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DetailsTopicComponent} from './details-topic.component';

describe('DetailsTopicComponent', () => {
  let component: DetailsTopicComponent;
  let fixture: ComponentFixture<DetailsTopicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsTopicComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
