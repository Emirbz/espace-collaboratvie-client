import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {JitsiFloatComponent} from './jitsi-float.component';

describe('JitsiFloatComponent', () => {
  let component: JitsiFloatComponent;
  let fixture: ComponentFixture<JitsiFloatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JitsiFloatComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JitsiFloatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
