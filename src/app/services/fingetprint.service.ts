import { Injectable, signal } from '@angular/core';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

@Injectable({ providedIn: 'root' })
export class FingerprintService {
  public deviceId = signal<string | null>(null);

  constructor() {
    this.initFingerprint();
  }

  private async initFingerprint() {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    this.deviceId.set(result.visitorId);
  }

  getDeviceId(): string | null {
    return this.deviceId();
  }

  async getDeviceIdAsync(): Promise<string> {
    if (this.deviceId()) {
      return this.deviceId()!;
    }
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    this.deviceId.set(result.visitorId);
    return result.visitorId;
  }
}
