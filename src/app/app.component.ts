import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LOCAL_STORAGE_KEY } from './core/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  standupForm: FormGroup;
  previousChecklistTitle: string;

  @HostListener('window:beforeunload', ['$event'])
  doSomething($event) {
    if (this.standupForm.dirty) {
      return ($event.returnValue = true);
    }
  }

  constructor(
    private fb: FormBuilder,
    public snackbar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.standupForm = this.fb.group({
      previousChecklist: this.fb.array([
        this.fb.control('', [Validators.required, Validators.minLength(20)]),
      ]),
      currentChecklist: this.fb.array([
        this.fb.control('', Validators.required),
      ]),
      blockers: this.fb.array(['']),
    });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
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
    formControl.push(
      new FormControl(
        '',
        controlName === 'blockers' ? undefined : [Validators.required]
      )
    );
  }

  removeFromChecklist(controlName: string, index: number) {
    const formControl = this.standupForm.get(controlName) as FormArray;
    formControl.removeAt(index);
  }

  setPreviousChecklistTitle(title: string) {
    this.previousChecklistTitle = title;
  }

  handleKeyTab(_event, controlName: string, inputIndex: number) {
    if (this[controlName].controls.length - 1 === inputIndex) {
      this.addToChecklist(controlName);
      this.cdr.detectChanges();
    }
    document.getElementById(`${controlName}${inputIndex + 1}`).focus();
  }

  onFormSaved() {
    this.standupForm.markAsPristine();
  }

  resetForm() {
    this.standupForm.reset();
    ['previousChecklist', 'currentChecklist', 'blockers'].forEach((field) => {
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
