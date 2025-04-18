// src/app/features/admin-panel/admin-panel.component.ts
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
      width: '400px',
    });

    ref.afterClosed().subscribe(async result => {
      if (result) {
        await this.backend.addItem(result);
        this.snackBar.open('Подарок добавлен!', 'Ок', { duration: 2000 });
      }
    });
  }

  openEditDialog(item: Item): void {
    const ref = this.dialog.open(AddEditItemDialogComponent, {
      data: item,
      width: '400px',
    });

    ref.afterClosed().subscribe(async result => {
      if (result) {
        await this.backend.updateItem(result);
        this.snackBar.open('Подарок обновлён!', 'Ок', { duration: 2000 });
      }
    });
  }

  async deleteItem(itemId: string) {
    await this.backend.deleteItem(itemId);
    this.snackBar.open('Подарок удалён', 'Ок', { duration: 2000 });
  }

  async cancelReservation(itemId: string, deviceId: string) {
    await this.backend.cancelReservation(itemId, deviceId);
    this.snackBar.open('Бронирование отменено', 'Ок', { duration: 2000 });
  }

  drop(event: CdkDragDrop<Item[]>): void {
    const updated = [...this.items()];
    moveItemInArray(updated, event.previousIndex, event.currentIndex);
    this.items.set(updated);
  }
}
