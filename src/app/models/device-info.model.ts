export interface DeviceInfo {
  fingerprintId: string;
  userAgent: string;
  screenResolution: string;
  language: string;
  timezone: string;
  ipAddress: string | null;
}
