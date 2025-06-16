import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreneauRPage } from './creneau-r.page';

describe('CreneauRPage', () => {
  let component: CreneauRPage;
  let fixture: ComponentFixture<CreneauRPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreneauRPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
