# ClientV18

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.12.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Sidebar / menu links (open in new tab)

In the sidebar we updated the `app-nav-item` implementation so menu items now render real anchor links (href/routerLink) and set `target` when configured. This makes the browser's native "Open in new tab" and context menu available for menu items. If a menu item needs to open a dynamic/constructed URL in a new tab (e.g. the "Open Accessories" item), the component still performs the window.open for that special-case logic.
