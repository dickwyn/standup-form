import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import ClipboardJS from 'clipboard';

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
export class PreviewComponent implements OnInit {
  @Input() previousChecklist: FormArray;
  @Input() currentChecklist: FormArray;
  @Input() blockers: FormArray;
  @Output() weekdayRegistered: EventEmitter<any> = new EventEmitter<any>();
  date: string;
  clipboardjs: any = new ClipboardJS('.copy-button');
  previousChecklistTitle = 'Yesterday';

  constructor(private snackbar: MatSnackBar) {}

  ngOnInit(): void {
    const todayDateObj = new Date();
    const month = ('0' + (todayDateObj.getMonth() + 1)).slice(-2);
    const day = ('0' + todayDateObj.getDate()).slice(-2);
    const year = String(todayDateObj.getFullYear()).slice(-2);

    this.date = `${month}/${day}/${year}`;

    if (localStorage.getItem('STANDUP_FORM_DATA') !== null) {
      const { expiration, previousChecklist, currentChecklist } = JSON.parse(
        localStorage.getItem('STANDUP_FORM_DATA')
      );

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
              todayDateObj.getMilliseconds() <
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
      localStorage.setItem('STANDUP_FORM_DATA', JSON.stringify(dataToSave));
      this.snackbar.open('Text copied', '', {
        duration: 3000,
        panelClass: 'copy-success',
      });
    });
  }

  isBlockersEmpty() {
    return (
      this.blockers.value.length === 0 ||
      (this.blockers.value.length > 0 &&
        !this.blockers.value.some((item) => item))
    );
  }
}
