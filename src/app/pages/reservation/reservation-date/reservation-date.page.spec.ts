import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservationDatePage } from './reservation-date.page';

describe('ReservationDatePage', () => {
  let component: ReservationDatePage;
  let fixture: ComponentFixture<ReservationDatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationDatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
