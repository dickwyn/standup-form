import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AppSettingsService } from '../../services/settings.service';
import { LOCAL_STORAGE_KEY } from '../../constants';
import { UserSettings } from '../../models/settings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class AppSettingsComponent implements OnInit {
  customizationsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private appSettingsService: AppSettingsService
  ) {}

  ngOnInit(): void {
    this.customizationsForm = this.fb.group({
      hideEmptyLists: false,
      displayDayOnPreviousChecklist: false,
    });

    if (localStorage.getItem(LOCAL_STORAGE_KEY.SETTINGS) !== null) {
      const { hideEmptyLists, displayDayOnPreviousChecklist } = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEY.SETTINGS)
      ) as UserSettings;

      this.customizationsForm.setValue({
        hideEmptyLists,
        displayDayOnPreviousChecklist,
      });
    }
  }

  onSave(): void {
    const toSave: UserSettings = {
      hideEmptyLists: this.hideEmptyLists.value,
      displayDayOnPreviousChecklist: this.displayDayOnPreviousChecklist.value,
    };

    localStorage.setItem(LOCAL_STORAGE_KEY.SETTINGS, JSON.stringify(toSave));
    this.appSettingsService.onUpdated();
  }

  get hideEmptyLists(): FormControl {
    return this.customizationsForm.get('hideEmptyLists') as FormControl;
  }

  get displayDayOnPreviousChecklist(): FormControl {
    return this.customizationsForm.get(
      'displayDayOnPreviousChecklist'
    ) as FormControl;
  }
}
