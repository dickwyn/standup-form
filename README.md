# StandupForm

![Azure Static Web Apps CI/CD](https://github.com/dickwyn/standup-form/workflows/Azure%20Static%20Web%20Apps%20CI/CD/badge.svg?branch=main)

### Easily write daily standup (scrum) updates to the team

A web app built with Angular that lets your write your updates from the previous day, plans for today and any blockers that you might be facing.

[![StandupForm](https://raw.githubusercontent.com/dickwyn/standup-form/main/.github/readme-app-preview.png)](https://www.standup-form.dickwyn.xyz)

## Features

- Light / dark mode option. Light mode is turned on by default.
- Saves the form data (until 11:59pm) when the preview contents have been copied.
- Empty input fields will hidden on the preview.
- 'Yesterday' header will switch to the day when time between the last copy of the preview exceeds 2 days.
- Clicking enter on an input field will create a new input field.

## Running the project

```
$ yarn install
$ yarn start
```
