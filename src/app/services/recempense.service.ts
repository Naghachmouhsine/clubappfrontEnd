import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecempenseService {
  private pointsSource = new BehaviorSubject<number>(0);
  points$ = this.pointsSource.asObservable();
  constructor() { }

  setPoints(points: number) {
    this.pointsSource.next(points);
  }

  getCurrentPoints(): number {
    return this.pointsSource.value;
  }

  deductPoints(points: number) {
    this.pointsSource.next(this.pointsSource.value - points);
  }
}
