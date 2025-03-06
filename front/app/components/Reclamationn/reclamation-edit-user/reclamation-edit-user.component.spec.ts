import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamationEditUserComponent } from './reclamation-edit-user.component';

describe('ReclamationEditUserComponent', () => {
  let component: ReclamationEditUserComponent;
  let fixture: ComponentFixture<ReclamationEditUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReclamationEditUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReclamationEditUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
