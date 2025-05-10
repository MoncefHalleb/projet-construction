import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtudesComponent } from './etudes.component';

describe('EtudesComponent', () => {
  let component: EtudesComponent;
  let fixture: ComponentFixture<EtudesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EtudesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
