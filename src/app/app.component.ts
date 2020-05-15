import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

declare var gtag;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  standupForm: FormGroup;
  isMonday = false;

  constructor(private fb: FormBuilder, public snackbar: MatSnackBar) {
    gtag('config', 'UA-64177134-1');
  }

  ngOnInit() {
    this.standupForm = this.fb.group({
      previousChecklist: this.fb.array(['']),
      currentChecklist: this.fb.array(['']),
      blockers: this.fb.array(['']),
    });
  }

  get currentChecklist() {
    return this.standupForm.get('currentChecklist') as FormArray;
  }

  get previousChecklist() {
    return this.standupForm.get('previousChecklist') as FormArray;
  }

  get blockers() {
    return this.standupForm.get('blockers') as FormArray;
  }

  addToChecklist(controlName: string) {
    const formControl = this.standupForm.get(controlName) as FormArray;
    formControl.push(new FormControl(''));
  }

  removeFromChecklist(controlName: string, index: number) {
    const formControl = this.standupForm.get(controlName) as FormArray;
    formControl.removeAt(index);
  }

  setIsMonday(isMonday: boolean) {
    this.isMonday = isMonday;
  }

  resetForm(): void {
    const fieldsToReset = ['previousChecklist', 'currentChecklist', 'blockers'];

    this.standupForm.reset();
    fieldsToReset.forEach((field) => {
      this[field].clear();
      this.addToChecklist(field);
    });

    this.snackbar.open('Form has been reset', '', {
      duration: 3000,
      panelClass: 'copy-success',
    });
  }
}
