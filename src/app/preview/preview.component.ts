import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray } from '@angular/forms';
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
    const month = todayDateObj.getMonth();
    const day = todayDateObj.getDate();
    const year = String(todayDateObj.getFullYear()).slice(-2);

    this.date = `${month}/${day}/${year}`;
    this.isMonday = todayDateObj.getDay() === 1;
    this.onWeekdayRegistered.emit(this.isMonday);

    this.clipboardjs.on('success', () => {
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
