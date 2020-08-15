import { Component, OnInit } from '@angular/core';
import newGithubIssueUrl from 'new-github-issue-url';
import { name, version, repository } from 'package.json';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  version = version;
  name = name;
  repositoryUrl = repository.url;
  newIssueUrl;

  constructor() {}

  ngOnInit(): void {
    this.newIssueUrl = newGithubIssueUrl({
      user: 'dickwyn',
      repo: name,
      body: '[Enter feedback here]',
    });
  }
}
