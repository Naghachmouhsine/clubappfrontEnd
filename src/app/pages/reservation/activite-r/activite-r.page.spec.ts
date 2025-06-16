import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActiviteRPage } from './activite-r.page';

describe('ActiviteRPage', () => {
  let component: ActiviteRPage;
  let fixture: ComponentFixture<ActiviteRPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiviteRPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
