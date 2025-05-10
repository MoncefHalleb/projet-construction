import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarFrontComponent } from './nav-bar-front.component';

describe('NavBarFrontComponent', () => {
  let component: NavBarFrontComponent;
  let fixture: ComponentFixture<NavBarFrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavBarFrontComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavBarFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
