import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly adminFlagKey = 'wishlist_isAdmin';
  private isAdminSignal = signal<boolean>(this.getAdminFromStorage());

  private getAdminFromStorage(): boolean {
    return localStorage.getItem(this.adminFlagKey) === 'true';
  }

  private updateStorage(value: boolean) {
    localStorage.setItem(this.adminFlagKey, value.toString());
  }

  enableAdminMode() {
    this.isAdminSignal.set(true);
    this.updateStorage(true);
  }

  disableAdminMode() {
    this.isAdminSignal.set(false);
    this.updateStorage(false);
  }

  isAdmin() {
    return computed(() => this.isAdminSignal());
  }

  getAdminStatus(): boolean {
    return this.isAdminSignal();
  }
}
