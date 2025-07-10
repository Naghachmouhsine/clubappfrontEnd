import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoriqueParticipationEvenementPage } from './historique-participation.page';

describe('HistoriqueParticipationEvenementPage', () => {
  let component: HistoriqueParticipationEvenementPage;
  let fixture: ComponentFixture<HistoriqueParticipationEvenementPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueParticipationEvenementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
