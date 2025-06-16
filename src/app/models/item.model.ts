export interface Item {
  id: string;
  title: string;
  description: string;
  link: string;
  collectionId: string;
  isActive: boolean;
  reservedBy?: string;
  reservedAt?: number;
  reservedDeviceId?: string;
  imageData?: string;
  sortOrder?: number;
}
