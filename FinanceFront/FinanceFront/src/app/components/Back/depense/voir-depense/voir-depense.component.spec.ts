import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoirDepenseComponent } from './voir-depense.component';

describe('VoirDepenseComponent', () => {
  let component: VoirDepenseComponent;
  let fixture: ComponentFixture<VoirDepenseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoirDepenseComponent]
    });
    fixture = TestBed.createComponent(VoirDepenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
