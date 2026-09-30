import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertCountService {

  private readonly _count = signal(0);

  readonly count = this._count.asReadonly();

  constructor() {

    const savedCount =
      sessionStorage.getItem('railflow_alert_count');

    if (savedCount !== null) {

      const parsedCount = Number(savedCount);

      if (!isNaN(parsedCount)) {
        this._count.set(parsedCount);
      }

    }
  }

  setCount(count: number): void {

    const safeCount = Math.max(0, count);

    this._count.set(safeCount);

    sessionStorage.setItem(
      'railflow_alert_count',
      String(safeCount)
    );
  }
}