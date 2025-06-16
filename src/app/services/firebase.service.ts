import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Item } from '../models/item.model';
import { v4 as uuidv4 } from 'uuid';
import { from, Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private firestore = inject(Firestore);

  getItems(collectionId: string = 'common'): Observable<Item[]> {
    const sortedQuery = query(collection(this.firestore, collectionId), orderBy('sortOrder', 'asc'));
    return collectionData(sortedQuery, { idField: 'id' }) as Observable<Item[]>;
  }

  addItem(item: Item, collectionId: string = 'common'): Observable<void> {
    const newItem: Item = { ...item, id: item.id || uuidv4(), collectionId: collectionId };
    const docRef = doc(this.firestore, `${collectionId}/${newItem.id}`);
    return from(setDoc(docRef, newItem));
  }

  deleteItem(itemId: string, collectionId: string = 'common'): Observable<void> {
    const docRef = doc(this.firestore, `${collectionId}/${itemId}`);
    return from(deleteDoc(docRef));
  }

  updateItem(item: Item, collectionId: string = 'common'): Observable<void> {
    const docRef = doc(this.firestore, `${collectionId}/${item.id}`);
    return from(
      updateDoc(docRef, {
        title: item.title,
        description: item.description,
        link: item.link,
        isActive: item.isActive,
        reservedBy: item.reservedBy ?? null,
        reservedAt: Date.now(),
        reservedDeviceId: item.reservedDeviceId ?? null,
        imageData: item.imageData ?? null,
        sortOrder: item.sortOrder ?? null,
        collectionId: collectionId,
      }),
    );
  }

  reserveItem(itemId: string, name: string, deviceId: string, collectionId: string = 'common'): Observable<void> {
    const docRef = doc(this.firestore, `${collectionId}/${itemId}`);
    return from(getDoc(docRef)).pipe(
      switchMap((snapshot) => {
        const item = snapshot.data() as Item;

        if (item?.reservedBy && item?.reservedDeviceId !== deviceId) {
          throw new Error('Item already reserved');
        }

        return from(
          updateDoc(docRef, {
            reservedBy: name,
            reservedAt: Date.now(),
            reservedDeviceId: deviceId,
          }),
        );
      }),
    );
  }

  cancelReservation(itemId: string, deviceId: string, collectionId: string = 'common'): Observable<void> {
    const docRef = doc(this.firestore, `${collectionId}/${itemId}`);
    return from(getDoc(docRef)).pipe(
      switchMap((snapshot) => {
        const item = snapshot.data() as Item;

        if (item?.reservedDeviceId === deviceId) {
          return from(
            updateDoc(docRef, {
              reservedAt: null,
              reservedBy: null,
              reservedDeviceId: null,
            }),
          );
        } else {
          throw new Error('You are not allowed to cancel this reservation');
        }
      }),
    );
  }
}
