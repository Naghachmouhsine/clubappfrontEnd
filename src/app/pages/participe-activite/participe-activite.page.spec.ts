import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParticipeActivitePage } from './participe-activite.page';

describe('ParticipeActivitePage', () => {
  let component: ParticipeActivitePage;
  let fixture: ComponentFixture<ParticipeActivitePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipeActivitePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
