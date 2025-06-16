import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateRPage } from './date-r.page';

describe('DateRPage', () => {
  let component: DateRPage;
  let fixture: ComponentFixture<DateRPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DateRPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
