import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import ClipboardJS from 'clipboard';
import { AppSettingsService } from '../../../core/services/settings.service';
import { LOCAL_STORAGE_KEY } from '../../../core/constants';

const weekday = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit, AfterViewInit {
  @Input() previousChecklist: FormArray;
  @Input() currentChecklist: FormArray;
  @Input() blockers: FormArray;
  @Output() onFormSaved: EventEmitter<any> = new EventEmitter<any>();
  @Output() weekdayRegistered: EventEmitter<any> = new EventEmitter<any>();
  date: string;
  clipboardjs: any = new ClipboardJS('.copy-button');
  previousChecklistTitle = 'Yesterday';
  userSettings;
  isBlockersEmpty: boolean;

  constructor(
    private snackbar: MatSnackBar,
    private appSettingsService: AppSettingsService
  ) {}

  ngOnInit(): void {
    const todayDateObj = new Date();
    const month = ('0' + (todayDateObj.getMonth() + 1)).slice(-2);
    const day = ('0' + todayDateObj.getDate()).slice(-2);
    const year = String(todayDateObj.getFullYear()).slice(-2);

    this.date = `${month}/${day}/${year}`;

    this.userSettings = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY.SETTINGS)
    );
    this.isBlockersEmpty = this.isFormArrayEmpty(this.blockers);

    if (
      localStorage.getItem(LOCAL_STORAGE_KEY.STANDUP_FORM_DATA) !== null ||
      localStorage.getItem('STANDUP_FORM_DATA') !== null
    ) {
      const lsKeyToUse =
        localStorage.getItem(LOCAL_STORAGE_KEY.STANDUP_FORM_DATA) === null
          ? 'STANDUP_FORM_DATA'
          : LOCAL_STORAGE_KEY.STANDUP_FORM_DATA;
      const { expiration, previousChecklist, currentChecklist } = JSON.parse(
        localStorage.getItem(lsKeyToUse)
      );

      if (this.userSettings) {
        this.previousChecklistTitle = this.userSettings
          .displayDayOnPreviousChecklist
          ? weekday[new Date(expiration - 86400001).getDay()]
          : 'Yesterday';
      }

      if (expiration > todayDateObj.getTime()) {
        if (currentChecklist !== undefined) {
          currentChecklist.forEach((item, index) => {
            this.currentChecklist.setControl(index, new FormControl(item));
          });
        }
        if (previousChecklist !== undefined) {
          previousChecklist.forEach((item, index) => {
            this.previousChecklist.setControl(index, new FormControl(item));
          });
        }
      } else {
        if (new Date(expiration).getDay() !== todayDateObj.getDay()) {
          this.previousChecklistTitle =
            weekday[new Date(expiration - 1000).getDay()];

          if (
            new Date(expiration).getMilliseconds() -
              todayDateObj.getMilliseconds() >
            345600000
          ) {
            this.previousChecklistTitle += ` (${new Date(
              expiration - 1
            ).toLocaleDateString()})`;
          }
        }
        if (currentChecklist !== undefined) {
          currentChecklist.forEach((item, index) => {
            this.previousChecklist.setControl(index, new FormControl(item));
          });
        }
      }
    }

    this.weekdayRegistered.emit(this.previousChecklistTitle);

    this.clipboardjs.on('success', () => {
      const dataToSave = {
        expiration: new Date().setHours(24, 0, 0, 0),
        currentChecklist: this.currentChecklist.value,
        previousChecklist: this.previousChecklist.value,
      };
      localStorage.setItem(
        LOCAL_STORAGE_KEY.STANDUP_FORM_DATA,
        JSON.stringify(dataToSave)
      );
      this.onFormSaved.emit();
      this.snackbar.open('Text copied', '', {
        duration: 3000,
        panelClass: 'copy-success',
      });
    });
  }

  ngAfterViewInit() {
    this.blockers.valueChanges.subscribe(() => {
      this.isBlockersEmpty = this.isFormArrayEmpty(this.blockers);
    });

    this.appSettingsService.updated.subscribe(() => {
      this.userSettings = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEY.SETTINGS)
      );

      if (localStorage.getItem(LOCAL_STORAGE_KEY.STANDUP_FORM_DATA) !== null) {
        const { expiration } = JSON.parse(
          localStorage.getItem(LOCAL_STORAGE_KEY.STANDUP_FORM_DATA)
        );

        this.previousChecklistTitle = this.userSettings
          .displayDayOnPreviousChecklist
          ? weekday[new Date(expiration - 86400001).getDay()]
          : 'Yesterday';
        this.weekdayRegistered.emit(this.previousChecklistTitle);
      }
    });
  }

  isFormArrayEmpty(formArray: FormArray): boolean {
    return (
      formArray.value.length === 0 ||
      (formArray.value.length > 0 && !formArray.value.some((item) => item))
    );
  }
}
