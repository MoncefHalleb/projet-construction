import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFrontListComponent } from './project-front-list.component';

describe('ProjectFrontListComponent', () => {
  let component: ProjectFrontListComponent;
  let fixture: ComponentFixture<ProjectFrontListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectFrontListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectFrontListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
