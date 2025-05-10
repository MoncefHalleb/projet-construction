import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherFrontComponent } from './weather-front.component';

describe('WeatherFrontComponent', () => {
  let component: WeatherFrontComponent;
  let fixture: ComponentFixture<WeatherFrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeatherFrontComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeatherFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
