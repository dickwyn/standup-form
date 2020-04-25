import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { name } from '../../package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  standupForm: FormGroup;
  appName: string = name;
  isDarkMode: boolean = true;

  constructor(private fb: FormBuilder) {}

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

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }
}
