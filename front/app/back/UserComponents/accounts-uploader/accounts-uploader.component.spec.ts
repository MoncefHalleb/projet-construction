import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsUploaderComponent } from './accounts-uploader.component';

describe('AccountsUploaderComponent', () => {
  let component: AccountsUploaderComponent;
  let fixture: ComponentFixture<AccountsUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountsUploaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountsUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
