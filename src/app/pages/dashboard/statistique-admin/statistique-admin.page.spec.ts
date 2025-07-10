import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatistiqueAdminPage } from './statistique-admin.page';

describe('StatistiqueAdminPage', () => {
  let component: StatistiqueAdminPage;
  let fixture: ComponentFixture<StatistiqueAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StatistiqueAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
