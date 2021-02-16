import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfComponent } from './user-inf.component';

describe('UserInfComponent', () => {
  let component: UserInfComponent;
  let fixture: ComponentFixture<UserInfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserInfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
