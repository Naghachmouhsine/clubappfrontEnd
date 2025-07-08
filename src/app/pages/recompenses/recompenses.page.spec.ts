import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecompensesPage } from './recompenses.page';

describe('RecompensesPage', () => {
  let component: RecompensesPage;
  let fixture: ComponentFixture<RecompensesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecompensesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
