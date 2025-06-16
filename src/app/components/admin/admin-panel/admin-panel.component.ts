import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Item } from '../../../models/item.model';
import { AddEditItemDialogComponent } from '../add-edit-item-dialog/add-edit-item-dialog.component';
import { FirebaseService } from '../../../services/firebase.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AdminItemCardComponent } from '../admin-item-card/admin-item-card.component';
import { COLLECTION_LIST, COMMON_COLLECTION } from '../../../const/list.const';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatSnackBarModule,
    DragDropModule,
    MatProgressSpinner,
    AdminItemCardComponent,
    MatIcon,
    MatButton,
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPanelComponent {
  private backend = inject(FirebaseService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  readonly loading = signal(true);
  readonly items = signal<Item[]>([]);
  readonly isExpanded = signal(true);

  commonCollection = COMMON_COLLECTION;
  collectionList = COLLECTION_LIST;
  currentCollection = COMMON_COLLECTION;

  constructor() {
    this.loadItems(this.currentCollection.route);
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

  openAddDialog(): void {
    const ref = this.dialog.open(AddEditItemDialogComponent, {
      data: null,
      width: '480px',
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.backend.addItem(result, this.currentCollection.route).pipe().subscribe(() => {
          this.snackBar.open('Подарок добавлен!', 'Ок', { duration: 2000 });
        });
      }
    });
  }

  openEditDialog(item: Item): void {
    const ref = this.dialog.open(AddEditItemDialogComponent, {
      data: item,
      width: '480px',
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.backend.updateItem({ ...item, ...result }, this.currentCollection.route).pipe().subscribe(() => {
          this.snackBar.open('Подарок обновлён!', 'Ок', { duration: 2000 });
        });
      }
    });
  }

  deleteItem(itemId: string): void {
    this.backend.deleteItem(itemId, this.currentCollection.route).pipe().subscribe(() => {
      this.snackBar.open('Подарок удалён', 'Ок', { duration: 2000 });
    });
  }

  cancelReservation(item: Item): void {
    this.backend.cancelReservation(item.id, item.reservedDeviceId, this.currentCollection.route).pipe().subscribe(() => {
      this.snackBar.open('Бронирование отменено', 'Ок', { duration: 2000 });
    });
  }

  drop(event: CdkDragDrop<Item[]>): void {
    const currentItems = [...this.items()];

    moveItemInArray(currentItems, event.previousIndex, event.currentIndex);

    currentItems.forEach((item, index) => {
      item.sortOrder = index;
      this.backend.updateItem({
        ...item,
        sortOrder: item.sortOrder,
      }, this.currentCollection.route).pipe().subscribe(() => {
      });
    });

    this.items.set(currentItems);
  }

  setCurrentCollection(collection: { route: string, name: string }): void {
    if (this.currentCollection.route === collection.route) return;
    this.currentCollection = collection;
    this.loadItems(this.currentCollection.route);
  }
}
