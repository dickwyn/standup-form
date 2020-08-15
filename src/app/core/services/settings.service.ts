import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppSettingsService {
  private updatedObservable = new Subject();
  updated = this.updatedObservable.asObservable();

  constructor() {}

  onUpdated(): void {
    this.updatedObservable.next({});
  }
}
