export interface Item {
  id: string;
  title: string;
  description: string;
  link: string;
  reservedBy?: string;
  reservedAt?: number;
  isActive: boolean;
  reservedDeviceId?: string;
}
