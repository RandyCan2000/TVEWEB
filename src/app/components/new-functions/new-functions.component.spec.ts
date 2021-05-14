import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFunctionsComponent } from './new-functions.component';

describe('NewFunctionsComponent', () => {
  let component: NewFunctionsComponent;
  let fixture: ComponentFixture<NewFunctionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewFunctionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFunctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
