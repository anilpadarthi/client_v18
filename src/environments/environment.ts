// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  isGeoLocationTurnOn : false,
  isAddressSearch: false,
  codMinimumCartValue: 50,
  bonusMinimCartValue: 50,
  instantBonusMinimumCartValue: 50,

  //host: 'http://localhost:5170',
  backend:  {
    //host: 'http://api.anglesims.co.uk'
    //host: 'https://localhost:51544'
    //host: 'http://localhost:8084'
    host: 'http://uat-api.leap-tel.com'
  },
  frontend:  {
    //host: 'http://localhost:4200' 
    host: 'http://uat.leap-tel.com' 
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
