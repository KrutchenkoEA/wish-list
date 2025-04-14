import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  orderBy,
  DocumentReference,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag.model';

@Injectable({ providedIn: 'root' })
export class TagService {
  private firestore = inject(Firestore);
  private tagsRef = collection(this.firestore, 'tags');

  // Получение всех тегов в реальном времени
  getTags(): Observable<Tag[]> {
    const tagsQuery = query(this.tagsRef, orderBy('name'));
    return collectionData(tagsQuery, { idField: 'id' }) as Observable<Tag[]>;
  }

  // Добавление нового тега
  async addTag(tagName: string): Promise<DocumentReference> {
    const tag: Tag = {
      id: '', // будет установлен Firestore
      name: tagName,
    };
    return await addDoc(this.tagsRef, tag);
  }

  // Обновление существующего тега
  async updateTag(id: string, newName: string): Promise<void> {
    const tagRef = doc(this.firestore, 'tags', id);
    await updateDoc(tagRef, { name: newName });
  }

  // Удаление тега
  async deleteTag(id: string): Promise<void> {
    const tagRef = doc(this.firestore, 'tags', id);
    await deleteDoc(tagRef);
  }
}
