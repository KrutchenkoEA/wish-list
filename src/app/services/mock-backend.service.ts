import { Injectable } from '@angular/core';
import { Item } from '../models/item.model';
import { Reservation } from '../models/reservation.model';
import { User } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class MockBackendService {
  private itemsKey = 'wishlist_items';
  private reservationsKey = 'wishlist_reservations';
  private usersKey = 'wishlist_users';

  constructor() {
    this.initData();
  }

  private initData() {
    if (!localStorage.getItem(this.itemsKey)) {
      const demoItems: Item[] = [
        {
          id: uuidv4(),
          title: 'Книга: Чистый код',
          description: 'Руководство по написанию читаемого кода',
          link: 'https://example.com/book',
          isActive: true,
        },
        {
          id: uuidv4(),
          title: 'Наушники Sony WH-1000XM4',
          description: 'Беспроводные наушники с шумоподавлением',
          link: 'https://example.com/headphones',
          isActive: true,
        },
      ];
      localStorage.setItem(this.itemsKey, JSON.stringify(demoItems));
      localStorage.setItem(this.reservationsKey, JSON.stringify([]));
      localStorage.setItem(this.usersKey, JSON.stringify([]));
    }
  }

  private getData<T>(key: string): T[] {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  private setData<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  async getItems(): Promise<Item[]> {
    return this.getData<Item>(this.itemsKey);
  }

  async addItem(item: Item): Promise<void> {
    const items = this.getData<Item>(this.itemsKey);
    items.push(item);
    this.setData(this.itemsKey, items);
  }

  async updateItem(updated: Item): Promise<void> {
    let items = this.getData<Item>(this.itemsKey);
    items = items.map(i => i.id === updated.id ? updated : i);
    this.setData(this.itemsKey, items);
  }

  async deleteItem(id: string): Promise<void> {
    const items = this.getData<Item>(this.itemsKey).filter(i => i.id !== id);
    this.setData(this.itemsKey, items);
  }

  async reserveItem(itemId: string, userName: string, deviceFingerprint: string): Promise<boolean> {
    const items = this.getData<Item>(this.itemsKey);
    const item = items.find(i => i.id === itemId);
    if (!item || !item.isActive || item.reservedBy) return false;

    item.reservedBy = userName;
    item.reservedAt = Date.now();
    this.setData(this.itemsKey, items);

    const reservations = this.getData<Reservation>(this.reservationsKey);
    reservations.push({
      id: uuidv4(),
      itemId,
      userName,
      deviceFingerprint,
      timestamp: Date.now()
    });
    this.setData(this.reservationsKey, reservations);
    return true;
  }

  async cancelReservation(itemId: string): Promise<void> {
    const items = this.getData<Item>(this.itemsKey);
    const item = items.find(i => i.id === itemId);
    if (item) {
      item.reservedBy = undefined;
      item.reservedAt = undefined;
      this.setData(this.itemsKey, items);
    }
    let reservations = this.getData<Reservation>(this.reservationsKey);
    reservations = reservations.filter(r => r.itemId !== itemId);
    this.setData(this.reservationsKey, reservations);
  }

  async getReservations(): Promise<Reservation[]> {
    return this.getData<Reservation>(this.reservationsKey);
  }

  async saveUser(user: User): Promise<void> {
    const users = this.getData<User>(this.usersKey);
    const index = users.findIndex(u => u.deviceId === user.deviceId);
    if (index > -1) users[index] = user;
    else users.push(user);
    this.setData(this.usersKey, users);
  }

  async getUserByDevice(deviceId: string): Promise<User | undefined> {
    return this.getData<User>(this.usersKey).find(u => u.deviceId === deviceId);
  }
}
