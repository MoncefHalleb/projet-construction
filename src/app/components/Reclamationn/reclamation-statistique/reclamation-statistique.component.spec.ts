import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamationStatistiqueComponent } from './reclamation-statistique.component';

describe('ReclamationStatistiqueComponent', () => {
  let component: ReclamationStatistiqueComponent;
  let fixture: ComponentFixture<ReclamationStatistiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReclamationStatistiqueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReclamationStatistiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
