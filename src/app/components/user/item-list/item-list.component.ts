import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Item } from '../../../models/item.model';
import { ItemCardComponent } from '../item-card/item-card.component';
import { FirebaseService } from '../../../services/firebase.service';
import { FingerprintService } from '../../../services/fingetprint.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ReservationComponent } from '../reservation/reservation.component';
import { ActivatedRoute } from '@angular/router';
import { ItemInfoComponent } from '../../item-info/item-info.component';
import { MatIcon } from '@angular/material/icon';
import { COMMON_COLLECTION } from '../../../const/list.const';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [
    CommonModule, MatGridListModule, MatProgressSpinnerModule, ItemCardComponent, ItemInfoComponent, MatIcon,
    MatIcon,
  ],
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
  private route = inject(ActivatedRoute);
  deviceId = inject(FingerprintService).getDeviceId();
  currentCollectionId: string | null = COMMON_COLLECTION.route;

  constructor() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('collectionId') ?? 'common';
      this.currentCollectionId = id;
      this.loadItems(id);
    });
  }

  loadItems(collectionId: string): void {
    this.loading.set(true);
    this.backend.getItems(collectionId).subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: () => {
        this.items.set([]);
        this.loading.set(false);
      },
    });
  }

  cancelReservation(item: Item): void {
    this.backend.cancelReservation(item.id, item.reservedDeviceId, this.currentCollectionId).pipe().subscribe(() => {
      this.snackBar.open('Бронирование отменено', 'Ок', { duration: 2000 });
    });
  }

  openReservation(item: Item): void {
    this.dialog.open(ReservationComponent, {
      data: { item, collectionId: this.currentCollectionId },
    });
  }
}
