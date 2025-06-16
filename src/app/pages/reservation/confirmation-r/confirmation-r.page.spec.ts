import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationRPage } from './confirmation-r.page';

describe('ConfirmationRPage', () => {
  let component: ConfirmationRPage;
  let fixture: ComponentFixture<ConfirmationRPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationRPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
