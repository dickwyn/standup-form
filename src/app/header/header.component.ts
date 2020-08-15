import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { name } from '../../../package.json';
import { AppSettingsComponent } from '../app-settings/app-settings.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  appName: string = name;
  body: DOMTokenList = document.getElementsByTagName('body')[0].classList;
  currentTheme = 'auto';
  themes = {
    auto: {
      name: 'auto',
      icon: 'brightness_auto',
    },
    dark: {
      name: 'dark',
      icon: 'brightness_2',
    },
    light: {
      name: 'light',
      icon: 'wb_sunny',
    },
  };

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    if (localStorage.getItem('darkMode') !== null) {
      this.currentTheme =
        localStorage.getItem('darkMode') === 'true' ? 'dark' : 'light';
    }
    this.updateThemeOnBrowser();
  }

  onThemeChanged(selectedTheme: string): void {
    if (selectedTheme !== this.currentTheme) {
      this.currentTheme = selectedTheme;
      this.updateThemeOnBrowser();
    }
  }

  updateThemeOnBrowser(): void {
    let userSelectedTheme = this.currentTheme;

    if (this.currentTheme === 'auto') {
      userSelectedTheme = this.prefersColorScheme('dark') ? 'dark' : 'light';
      localStorage.removeItem('darkMode');
    } else {
      localStorage.setItem(
        'darkMode',
        this.currentTheme === 'dark' ? 'true' : 'false'
      );
    }
    this.body.remove('dark', 'light');
    this.body.add(userSelectedTheme);
  }

  prefersColorScheme(preferredTheme: string): boolean {
    return window.matchMedia(`(prefers-color-scheme: ${preferredTheme})`)
      .matches;
  }

  openDialog() {
    this.dialog.open(AppSettingsComponent, {
      disableClose: true,
    });
  }
}
