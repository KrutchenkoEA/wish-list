import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Item } from '../../../models/item.model';
import { AddEditItemDialogComponent } from '../add-edit-item-dialog/add-edit-item-dialog.component';
import { MatChip } from '@angular/material/chips';
import { FirebaseService } from '../../../services/firebase.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    DragDropModule,
    MatChip,
    MatProgressSpinner,
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

  openAddDialog(): void {
    const ref = this.dialog.open(AddEditItemDialogComponent, {
      data: null,
      width: '480px',
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.backend.addItem(result).pipe().subscribe(() => {
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
        this.backend.updateItem({ ...item, ...result }).pipe().subscribe(() => {
          this.snackBar.open('Подарок обновлён!', 'Ок', { duration: 2000 });
        });
      }
    });
  }

  deleteItem(itemId: string): void {
    this.backend.deleteItem(itemId).pipe().subscribe(() => {
      this.snackBar.open('Подарок удалён', 'Ок', { duration: 2000 });
    });
  }

  cancelReservation(itemId: string, deviceId: string): void {
    this.backend.cancelReservation(itemId, deviceId).pipe().subscribe(() => {
      this.snackBar.open('Бронирование отменено', 'Ок', { duration: 2000 });
    });
  }

  drop(event: CdkDragDrop<Item[]>): void {
    const currentItems = [...this.items()];

    moveItemInArray(currentItems, event.previousIndex, event.currentIndex);

    currentItems.forEach((item, index) => {
      item.sortOrder = index;
      this.backend.updateItem({ ...item, sortOrder: item.sortOrder });
    });

    this.items.set(currentItems);
  }
}
