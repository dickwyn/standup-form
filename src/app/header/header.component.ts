import { Component, OnInit } from '@angular/core';
import { name } from '../../../package.json';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  appName: string = name;
  isDarkMode = false;
  body: DOMTokenList = document.getElementsByTagName('body')[0].classList;

  ngOnInit(): void {
    if (localStorage.getItem('darkMode') !== null) {
      this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    }
    this.updateThemeOnBrowser();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.updateThemeOnBrowser();
  }

  updateThemeOnBrowser(): void {
    this.body.remove(!this.isDarkMode ? 'dark' : 'light');
    this.body.add(this.isDarkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', this.isDarkMode ? 'true' : 'false');
  }
}
