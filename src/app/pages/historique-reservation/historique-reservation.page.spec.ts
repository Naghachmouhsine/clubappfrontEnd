import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoriqueReservationPage } from './historique-reservation.page';

describe('HistoriqueReservationPage', () => {
  let component: HistoriqueReservationPage;
  let fixture: ComponentFixture<HistoriqueReservationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueReservationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
