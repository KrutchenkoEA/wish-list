import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  orderBy,
  query,
  setDoc,
  updateDoc,
  Timestamp
} from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { DeviceInfo } from '../models/device-info.model';
import { ItemModel } from '../models/item.model';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private firestore = inject(Firestore);
  private itemsRef = collection(this.firestore, 'items');
  private items$ = collectionData(query(this.itemsRef, orderBy('createdAt', 'desc')), {
    idField: 'id',
  }) as Observable<ItemModel[]>;
  items = toSignal(this.items$, { initialValue: [] });

  getItemById(id: string): Observable<ItemModel> {
    const ref = doc(this.firestore, 'items', id);
    return docData(ref, { idField: 'id' }) as Observable<ItemModel>;
  }

  async createItem(item: ItemModel): Promise<void> {
    const itemRef = doc(this.itemsRef); // генерируем новый ID
    const now = new Date();
    const newItem: ItemModel = {
      ...item,
      id: itemRef.id,
      status: 'available',
      bookedByName: null,
      bookedByDevice: null,
      maybeBy: [],
      comments: [],
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(itemRef, newItem);
  }

  async updateItem(id: string, data: Partial<ItemModel>): Promise<void> {
    const now = new Date();
    const ref = doc(this.firestore, 'items', id);
    await updateDoc(ref, {
      ...data,
      updatedAt: now,
    });
  }

  async deleteItem(id: string): Promise<void> {
    const ref = doc(this.firestore, 'items', id);
    await deleteDoc(ref);
  }

  async bookItem(itemId: string, name: string, device: DeviceInfo): Promise<void> {
    const itemRef = doc(this.firestore, 'items', itemId);
    await updateDoc(itemRef, {
      status: 'booked',
      bookedByName: name,
      bookedByDevice: device,
      updatedAt: Timestamp.now(),
    });
  }
}
