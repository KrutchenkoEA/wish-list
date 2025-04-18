// src/app/features/admin-panel/admin-panel.component.ts
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MockBackendService } from '../../../services/mock-backend.service';
import { Item } from '../../../models/item.model';
import { AddEditItemDialogComponent } from '../add-edit-item-dialog/add-edit-item-dialog.component';

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
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminPanelComponent implements OnInit {
  private backend = inject(MockBackendService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  readonly items = signal<Item[]>([]);

  readonly reservedItems = computed(() => this.items().filter(i => i.reservedBy));
  readonly availableItems = computed(() => this.items().filter(i => !i.reservedBy));

  ngOnInit(): void {
    this.loadItems();
  }

  async loadItems() {
    const all = await this.backend.getItems();
    this.items.set(all);
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
        this.loadItems();
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
        this.loadItems();
      }
    });
  }

  async deleteItem(itemId: string) {
    await this.backend.deleteItem(itemId);
    this.snackBar.open('Подарок удалён', 'Ок', { duration: 2000 });
    this.loadItems();
  }

  async cancelReservation(itemId: string) {
    await this.backend.cancelReservation(itemId);
    this.snackBar.open('Бронирование отменено', 'Ок', { duration: 2000 });
    this.loadItems();
  }

  drop(event: CdkDragDrop<Item[]>): void {
    const updated = [...this.items()];
    moveItemInArray(updated, event.previousIndex, event.currentIndex);
    this.items.set(updated);
  }
}
