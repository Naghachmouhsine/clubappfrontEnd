import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DateHeureParticipationModalComponent } from './date-heure-participation-modal.component';

describe('DateHeureParticipationModalComponent', () => {
  let component: DateHeureParticipationModalComponent;
  let fixture: ComponentFixture<DateHeureParticipationModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DateHeureParticipationModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DateHeureParticipationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
