import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InstallationModalComponent } from './installation-modal.component';

describe('InstallationModalComponent', () => {
  let component: InstallationModalComponent;
  let fixture: ComponentFixture<InstallationModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [InstallationModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InstallationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
