import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClubhousePage } from './clubhouse.page';

describe('ClubhousePage', () => {
  let component: ClubhousePage;
  let fixture: ComponentFixture<ClubhousePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubhousePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
