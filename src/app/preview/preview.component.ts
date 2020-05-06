import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import ClipboardJS from 'clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit {
  @Input() previousChecklist: FormArray;
  @Input() currentChecklist: FormArray;
  @Input() blockers: FormArray;
  @Output() onWeekdayRegistered: EventEmitter<any> = new EventEmitter<any>();
  date: string;
  isMonday: boolean;
  clipboardjs: any = new ClipboardJS('.standup-preview');

  constructor(public snackbar: MatSnackBar) {}

  ngOnInit(): void {
    const todayDateObj = new Date();
    const month = ('0' + (todayDateObj.getMonth() + 1)).slice(-2);
    const day = ('0' + todayDateObj.getDate()).slice(-2);
    const year = String(todayDateObj.getFullYear()).slice(-2);

    this.date = `${month}/${day}/${year}`;
    this.isMonday = todayDateObj.getDay() === 1;
    this.onWeekdayRegistered.emit(this.isMonday);

    if (localStorage.getItem('STANDUP_FORM_DATA') !== null) {
      const restored = JSON.parse(localStorage.getItem('STANDUP_FORM_DATA'));

      if (restored.expiration < todayDateObj.getTime()) {
        restored.currentChecklist.forEach((item, index) => {
          this.currentChecklist.setControl(index, new FormControl(item));
        });
        restored.previousChecklist.forEach((item, index) => {
          this.previousChecklist.setControl(index, new FormControl(item));
        });
      } else {
        restored.currentChecklist.forEach((item, index) => {
          this.previousChecklist.setControl(index, new FormControl(item));
        });
      }
    }

    this.clipboardjs.on('success', () => {
      const dataToSave = {
        expiration: todayDateObj.setHours(24, 0, 0, 0),
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
