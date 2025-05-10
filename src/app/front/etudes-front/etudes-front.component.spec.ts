import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtudesFrontComponent } from './etudes-front.component';

describe('EtudesFrontComponent', () => {
  let component: EtudesFrontComponent;
  let fixture: ComponentFixture<EtudesFrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EtudesFrontComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EtudesFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
