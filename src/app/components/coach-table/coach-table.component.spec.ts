import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachTableComponent } from './coach-table.component';

describe('CoachTableComponent', () => {
  let component: CoachTableComponent;
  let fixture: ComponentFixture<CoachTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoachTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
