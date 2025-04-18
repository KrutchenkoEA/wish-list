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

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatProgressSpinnerModule, ItemCardComponent],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  async cancelReservation(item: Item) {
    await this.backend.cancelReservation(item.id, this.deviceId);
    this.snackBar.open('Бронирование отменено', 'Ок', { duration: 2000 });
  }

  openReservation(item: Item): void {
    this.dialog.open(ReservationComponent, {
      data: { item },
    });
  }
}
