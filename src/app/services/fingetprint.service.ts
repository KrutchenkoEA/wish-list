import { Injectable } from '@angular/core';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export interface DeviceInfo {
  fingerprintId: string;
  userAgent: string;
  screenResolution: string;
  language: string;
  timezone: string;
  ipAddress: string | null;
}

@Injectable({ providedIn: 'root' })
export class FingerprintService {
  private deviceInfo: DeviceInfo | null = null;

  async getDeviceInfo(): Promise<DeviceInfo> {
    if (this.deviceInfo) return this.deviceInfo;

    // Получаем Fingerprint ID
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const fingerprintId = result.visitorId;

    // Получаем IP через внешний API
    const ip = await fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => data.ip)
      .catch(() => null);

    // Получаем остальные данные
    const userAgent = navigator.userAgent;
    const screenResolution = `${screen.width}x${screen.height}`;
    const language = navigator.language;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    this.deviceInfo = {
      fingerprintId,
      userAgent,
      screenResolution,
      language,
      timezone,
      ipAddress: ip,
    };

    return this.deviceInfo;
  }
}
