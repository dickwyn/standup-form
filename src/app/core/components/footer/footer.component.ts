import { Component, OnInit } from '@angular/core';
import newGithubIssueUrl from 'new-github-issue-url';
import packageJson from '../../../../../package.json';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  version = packageJson.version;
  name = packageJson.name;
  repositoryUrl = packageJson.repository.url;
  newIssueUrl;

  ngOnInit(): void {
    this.newIssueUrl = newGithubIssueUrl({
      user: 'dickwyn',
      repo: packageJson.name,
      body: '[Enter feedback here]',
    });
  }
}
