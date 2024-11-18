import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  UntypedFormArray,
  UntypedFormControl,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LOCAL_STORAGE_KEY } from './core/constants';

declare var gtag;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  standupForm: UntypedFormGroup;
  previousChecklistTitle: string;
  @HostListener('window:beforeunload', ['$event'])
  doSomething($event) {
    if (this.standupForm.dirty) {
      return ($event.returnValue = true);
    }
  }

  constructor(
    private fb: UntypedFormBuilder,
    public snackbar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    gtag('config', 'UA-64177134-1');
  }

  ngOnInit() {
    this.standupForm = this.fb.group({
      previousChecklist: this.fb.array(['']),
      currentChecklist: this.fb.array(['']),
      blockers: this.fb.array(['']),
    });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  get currentChecklist() {
    return this.standupForm.get('currentChecklist') as UntypedFormArray;
  }

  get previousChecklist() {
    return this.standupForm.get('previousChecklist') as UntypedFormArray;
  }

  get blockers() {
    return this.standupForm.get('blockers') as UntypedFormArray;
  }

  addToChecklist(controlName: string) {
    const formControl = this.standupForm.get(controlName) as UntypedFormArray;
    formControl.push(new UntypedFormControl(''));
  }

  removeFromChecklist(controlName: string, index: number) {
    const formControl = this.standupForm.get(controlName) as UntypedFormArray;
    formControl.removeAt(index);
  }

  setPreviousChecklistTitle(title: string) {
    this.previousChecklistTitle = title;
  }

  handleKeyTab(event, controlName: string, inputIndex: number) {
    if (this[controlName].controls.length - 1 === inputIndex) {
      this.addToChecklist(controlName);
      this.cdr.detectChanges();
    }
    document.getElementById(`${controlName}${inputIndex + 1}`).focus();
  }

  onFormSaved() {
    this.standupForm.markAsPristine();
  }

  resetForm(): void {
    const fieldsToReset = ['previousChecklist', 'currentChecklist', 'blockers'];

    this.standupForm.reset();
    fieldsToReset.forEach((field) => {
      this[field].clear();
      this.addToChecklist(field);
    });
    localStorage.removeItem(LOCAL_STORAGE_KEY.STANDUP_FORM_DATA);

    this.snackbar.open('Form has been reset', '', {
      duration: 3000,
      panelClass: 'copy-success',
    });
  }
}
