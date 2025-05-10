import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingCostComponent } from './building-cost.component';

describe('BuildingCostComponent', () => {
  let component: BuildingCostComponent;
  let fixture: ComponentFixture<BuildingCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuildingCostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuildingCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
