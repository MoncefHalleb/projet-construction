import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficheProjectComponent } from './affiche-project.component';

describe('AfficheProjectComponent', () => {
  let component: AfficheProjectComponent;
  let fixture: ComponentFixture<AfficheProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AfficheProjectComponent]
    });
    fixture = TestBed.createComponent(AfficheProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
