import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AppSettingsService } from '../../services/settings.service';

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

    if (localStorage.getItem('appSettings') !== null) {
      const { hideEmptyLists, displayDayOnPreviousChecklist } = JSON.parse(
        localStorage.getItem('appSettings')
      );

      this.customizationsForm.setValue({
        hideEmptyLists,
        displayDayOnPreviousChecklist,
      });
    }
  }

  onSave(): void {
    localStorage.setItem(
      'appSettings',
      JSON.stringify({
        hideEmptyLists: this.hideEmptyLists.value,
        displayDayOnPreviousChecklist: this.displayDayOnPreviousChecklist.value,
      })
    );
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
