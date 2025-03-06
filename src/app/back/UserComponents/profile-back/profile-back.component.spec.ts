import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileBackComponent } from './profile-back.component';

describe('ProfileBackComponent', () => {
  let component: ProfileBackComponent;
  let fixture: ComponentFixture<ProfileBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileBackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
