import { Component, OnInit } from '@angular/core';
import newGithubIssueUrl from 'new-github-issue-url';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  version = '2.0.0';
  name = 'standup-form';
  repositoryUrl = 'standup-form.dickwyn.xyz';
  newIssueUrl;

  constructor() {}

  ngOnInit(): void {
    // this.newIssueUrl = newGithubIssueUrl({
    //   user: 'dickwyn',
    //   repo,
    //   body: '[Enter feedback here]',
    // });
  }
}
