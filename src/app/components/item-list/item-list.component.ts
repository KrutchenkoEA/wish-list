import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Item } from '../../models/item.model';
import { ItemCardComponent } from '../item-card/item-card.component';
import { FirebaseService } from '../../services/firebase.service';
import { FingerprintService } from '../../services/fingetprint.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ReservationComponent } from '../reservation/reservation.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatProgressSpinnerModule, ItemCardComponent, MatIcon, MatButton],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('expandCollapse', [
      state('expanded', style({ height: '*', opacity: 1 })),
      state('collapsed', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      transition('expanded <=> collapsed', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class ItemListComponent {
  private backend = inject(FirebaseService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  readonly loading = signal(true);
  readonly items = signal<Item[]>([]);

  readonly activeItems = computed(() =>
    this.items()?.filter(item => item.isActive),
  );

  deviceId = inject(FingerprintService).getDeviceId();

  rulesCollapsed = localStorage.getItem('wishlist_rulesCollapsed') === 'false';

  constructor() {
    effect(() => {
      this.loading.set(true);
      this.backend.getItems().subscribe({
        next: (items) => {
          this.items.set(items);
          this.loading.set(false);
        },
        error: () => {
          this.items.set([]);
          this.loading.set(false);
        },
      });
    });
  }

  cancelReservation(item: Item): void {
    this.backend.cancelReservation(item.id, item.reservedDeviceId).pipe().subscribe(() => {
      this.snackBar.open('Бронирование отменено', 'Ок', { duration: 2000 });
    });
  }

  openReservation(item: Item): void {
    this.dialog.open(ReservationComponent, {
      data: { item },
    });
  }

  toggleRules(): void {
    this.rulesCollapsed = !this.rulesCollapsed;
    localStorage.setItem('wishlist_rulesCollapsed', this.rulesCollapsed.toString());
  }
}
