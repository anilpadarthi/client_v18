import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class GeolocationService {
  constructor() {}

  getCurrentLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      } else {
        reject({ code: 0, message: 'Geolocation not supported' });
      }
    });
  }
}
