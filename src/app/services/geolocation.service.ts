import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class GeolocationService {
  constructor() {}

  getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          (error) => {
            reject(`Geolocation error: ${error.message}`);
          }
        );
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  }
}
