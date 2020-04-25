import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @Input() appearance: 'outline';
  standupForm: FormGroup;
  date: String;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const todayDateObj = new Date();
    const month = todayDateObj.getMonth();
    const day = todayDateObj.getDate();
    const year = String(todayDateObj.getFullYear()).slice(-2);
    this.date = `${month}/${day}/${year}`;

    this.standupForm = this.fb.group({
      previousChecklist: this.fb.array(['']),
      currentChecklist: this.fb.array(['']),
      blockers: '',
    });

    // for debugging purposes only
    this.standupForm.valueChanges.subscribe(console.log);
  }

  get currentChecklist() {
    return this.standupForm.get('currentChecklist') as FormArray;
  }

  get previousChecklist() {
    return this.standupForm.get('previousChecklist') as FormArray;
  }

  addToChecklist(controlName: string) {
    const formControl = this.standupForm.get(controlName) as FormArray;
    formControl.push(new FormControl(''));
  }

  removeFromChecklist(controlName: string, index: number) {
    const formControl = this.standupForm.get(controlName) as FormArray;
    formControl.removeAt(index);
  }
}
