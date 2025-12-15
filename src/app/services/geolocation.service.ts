import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class GeolocationService {
  private inFlight: Promise<GeolocationPosition> | null = null;
  private cache: { pos: GeolocationPosition; ts: number } | null = null;
  private cacheTtl = 10000; // ms

  constructor() {}

  /**
   * Get current position with deduplication, caching, retries and a watch fallback.
   * Returns the same in-flight promise for overlapping calls.
   */
  getCurrentLocation(retries = 2): Promise<GeolocationPosition> {
    if (this.cache && Date.now() - this.cache.ts < this.cacheTtl) {
      return Promise.resolve(this.cache.pos);
    }

    if (this.inFlight) return this.inFlight;

    const attempt = (attemptsLeft: number): Promise<GeolocationPosition> => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject({ code: 0, message: 'Geolocation not supported' });
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this.cache = { pos, ts: Date.now() };
            resolve(pos);
          },
          (err) => {
            // err.code: 1=PERMISSION_DENIED, 2=POSITION_UNAVAILABLE, 3=TIMEOUT
            const code = err && err.code ? err.code : null;
            if ((code === 2 || code === 3) && attemptsLeft > 0) {
              // retry after short delay
              const delay = 500 + (retries - attemptsLeft) * 500;
              setTimeout(() => {
                attempt(attemptsLeft - 1).then(resolve).catch(reject);
              }, delay);
              return;
            }

            if (code === 3) {
              // on timeout, try a watchPosition fallback once
              const watchId = navigator.geolocation.watchPosition(
                (p) => {
                  navigator.geolocation.clearWatch(watchId);
                  this.cache = { pos: p, ts: Date.now() };
                  resolve(p);
                },
                (e) => {
                  navigator.geolocation.clearWatch(watchId);
                  reject(e);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
              );
              return;
            }

            reject(err);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      });
    };

    this.inFlight = attempt(retries);
    this.inFlight.finally(() => (this.inFlight = null));
    return this.inFlight;
  }
}
