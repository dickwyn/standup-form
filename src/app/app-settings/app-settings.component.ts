import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AppSettingsService } from '../services/app-settings.service';

@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.scss'],
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
    });

    if (localStorage.getItem('appSettings') !== null) {
      const { hideEmptyLists } = JSON.parse(
        localStorage.getItem('appSettings')
      );

      this.customizationsForm.setValue({
        hideEmptyLists,
      });
    }
  }

  onSave(): void {
    localStorage.setItem(
      'appSettings',
      JSON.stringify({
        hideEmptyLists: this.hideEmptyLists.value,
      })
    );
    this.appSettingsService.onUpdated();
  }

  get hideEmptyLists(): FormControl {
    return this.customizationsForm.get('hideEmptyLists') as FormControl;
  }
}
