import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Item } from '../models/item.model';
import { v4 as uuidv4 } from 'uuid';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private firestore = inject(Firestore);
  private itemsRef = collection(this.firestore, 'items');

  getItems() {
    return collectionData(this.itemsRef, { idField: 'id' }) as unknown as Observable<Item[]>;
  }

  async addItem(item: Item): Promise<void> {
    const newItem: Item = { ...item, id: item.id || uuidv4() };
    const docRef = doc(this.itemsRef, newItem.id);
    await setDoc(docRef, newItem);
  }

  async deleteItem(itemId: string): Promise<void> {
    const docRef = doc(this.itemsRef, itemId);
    await deleteDoc(docRef);
  }

  async updateItem(item: Item): Promise<void> {
    const docRef = doc(this.itemsRef, item.id);
    await updateDoc(docRef, {
      title: item.title,
      description: item.description,
      link: item.link,
      isActive: item.isActive,
      reservedBy: item.reservedBy ?? null,
      reservedAt: Date.now(),
      reservedDeviceId: item.reservedDeviceId ?? null,
    });
  }

  async reserveItem(itemId: string, name: string, deviceId: string): Promise<void> {
    const docRef = doc(this.itemsRef, itemId);
    const snapshot = await getDoc(docRef);
    const item = snapshot.data() as Item;

    if (item?.reservedBy && item?.reservedDeviceId !== deviceId) {
      throw new Error('Item already reserved');
    }

    await updateDoc(docRef, {
      reservedBy: name,
      reservedAt: Date.now(),
      reservedDeviceId: deviceId,
    });
  }

  async cancelReservation(itemId: string, deviceId: string): Promise<void> {
    const docRef = doc(this.itemsRef, itemId);
    const snapshot = await getDoc(docRef);
    const item = snapshot.data() as Item;

    if (item?.reservedDeviceId === deviceId) {
      await updateDoc(docRef, {
        reservedAt: null,
        reservedBy: null,
        reservedDeviceId: null,
      });
    } else {
      throw new Error('You are not allowed to cancel this reservation');
    }
  }
}
