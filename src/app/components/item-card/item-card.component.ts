import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ItemModel } from '../../models/item.model';
import { MatDialog } from '@angular/material/dialog';
import { ItemService } from '../../services/item.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookingDialogComponent } from '../booking-dialog/booking-dialog.component';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
})
export class ItemCardComponent {
  @Input() item!: ItemModel;
  private dialog = inject(MatDialog);
  private itemService = inject(ItemService);
  private snackBar = inject(MatSnackBar);

  get statusColor(): string {
    switch (this.item.status) {
      case 'available':
        return 'primary';
      case 'booked':
        return 'warn';
      case 'maybe':
        return 'accent';
      default:
        return '';
    }
  }

  openBookingDialog() {
    const dialogRef = this.dialog.open(BookingDialogComponent);

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          await this.itemService.bookItem(this.item.id, result.name, result.device);
          this.snackBar.open('Подарок забронирован!', 'ОК', { duration: 3000 });
        } catch (error) {
          this.snackBar.open('Ошибка бронирования', 'ОК', { duration: 3000 });
          console.error(error);
        }
      }
    });
  }
}
