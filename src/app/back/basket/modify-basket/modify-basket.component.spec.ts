import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyBasketComponent } from './modify-basket.component';

describe('ModifyBasketComponent', () => {
  let component: ModifyBasketComponent;
  let fixture: ComponentFixture<ModifyBasketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyBasketComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifyBasketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
