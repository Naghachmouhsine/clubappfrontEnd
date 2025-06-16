import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeRPage } from './home-r.page';

describe('HomeRPage', () => {
  let component: HomeRPage;
  let fixture: ComponentFixture<HomeRPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeRPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
