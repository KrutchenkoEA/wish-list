import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  collectionGroup,
  doc,
  getDocs,
  writeBatch,
} from '@angular/fire/firestore';
import { Item } from '../models/item.model';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MigrationService {
  constructor(private firestore: Firestore) {}

  migrateItemsToCommonList(): Observable<void> {
    const sourceCollection = collection(this.firestore, 'items');

    return from(
      (async () => {
        const snapshot = await getDocs(sourceCollection);
        if (snapshot.empty) {
          console.warn('Коллекция items пуста.');
          return;
        }

        const batch = writeBatch(this.firestore);

        snapshot.forEach(docSnap => {
          const data = docSnap.data() as Item;
          const newRef = doc(this.firestore, `common/${docSnap.id}`);

          batch.set(newRef, {
            ...data,
            listId: 'common',
          });
        });

        await batch.commit();
        console.log('Миграция завершена успешно.');
      })()
    );
  }
}
