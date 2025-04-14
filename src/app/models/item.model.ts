export interface DeviceInfo {
  fingerprintId: string;
  userAgent: string;
  screenResolution: string;
  language: string;
  timezone: string;
  ipAddress: string | null;
}

export interface Comment {
  name: string;
  text: string;
  timestamp: any;
  device: DeviceInfo;
}

export interface MaybeEntry {
  name: string;
  device: DeviceInfo;
  timestamp: any;
}

export interface ItemModel {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  status: 'available' | 'booked' | 'maybe';
  bookedByName: string | null;
  bookedByDevice: DeviceInfo | null;
  maybeBy: MaybeEntry[];
  comments: Comment[];
}
