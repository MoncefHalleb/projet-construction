import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamationListUserComponent } from './reclamation-list-user.component';

describe('ReclamationListUserComponent', () => {
  let component: ReclamationListUserComponent;
  let fixture: ComponentFixture<ReclamationListUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReclamationListUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReclamationListUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
