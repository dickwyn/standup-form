import { Component, OnInit } from '@angular/core';
import { name } from '../../../package.json';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  appName: string = name;
  isDarkMode: boolean = true;

  constructor() {}

  ngOnInit(): void {}

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }
}
