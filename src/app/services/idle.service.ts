import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdleService {

  // ✅ 30 Minutes Idle Limit
  private idleLimit = 30 * 60 * 1000;

  // Timeout Event
  public onTimeout = new Subject<void>();

  constructor(private ngZone: NgZone) {}

  startWatching() {

    // Save initial activity time
    this.updateLastActivity();

    // Track user actions
    ["mousemove", "keydown", "click", "scroll"].forEach(event => {
      window.addEventListener(event, () => {
        this.updateLastActivity();
      });
    });

    // ✅ Check idle every 15 seconds
    setInterval(() => {
      this.checkIdle();
    }, 15000);

    // ✅ When user comes back after minimize/background
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        this.checkIdle();
      }
    });
  }

  // ✅ Store last active timestamp
  updateLastActivity() {
    localStorage.setItem("lastActivity", Date.now().toString());
  }

  // ✅ Check idle duration
  checkIdle() {

    const last = localStorage.getItem("lastActivity");

    if (!last) return;

    const diff = Date.now() - parseInt(last);

    if (diff > this.idleLimit) {

      this.ngZone.run(() => {

        this.onTimeout.next();
      });
    }
  }

  stopWatching() {
    localStorage.removeItem("lastActivity");
  }
}
