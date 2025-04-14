import { Injectable, inject, signal } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, User, authState, signOut } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  private _user = toSignal(authState(this.auth), { initialValue: null });

  user = computed(() => this._user());
  isLoggedIn = computed(() => !!this._user());
  isAdmin = signal(false);

  constructor() {
    this._checkRole();
  }

  private async _checkRole() {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return;
    const docRef = doc(this.firestore, 'users', currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const role = docSnap.data()['role'];
      this.isAdmin.set(role === 'admin');
    }
  }

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);
    return this._handleLogin(result.user, 'google');
  }

  async signInWithYandex() {
    const provider = new GoogleAuthProvider(); // Yandex OAuth fallback через Google
    const result = await signInWithPopup(this.auth, provider);
    return this._handleLogin(result.user, 'yandex');
  }

  async signOut() {
    await signOut(this.auth);
    this.isAdmin.set(false);
    this.router.navigate(['/']);
  }

  private async _handleLogin(user: User, provider: 'google' | 'yandex' | 'email') {
    const userRef = doc(this.firestore, 'users', user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        name: user.displayName || 'No name',
        role: 'user',
        provider,
      });
    }

    await this._checkRole();
    this.router.navigate(['/']);
  }
}
