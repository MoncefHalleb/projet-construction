import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReponseListComponent } from './reponse-list.component';

describe('ReponseListComponent', () => {
  let component: ReponseListComponent;
  let fixture: ComponentFixture<ReponseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReponseListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReponseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
