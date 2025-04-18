import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Item } from '../../models/item.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReservationComponent } from '../reservation/reservation.component';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDialogModule],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemCardComponent {
  @Input() item!: Item;
  private dialog = inject(MatDialog);

  openReservationDialog(): void {
    this.dialog.open(ReservationComponent, {
      data: { item: this.item },
    });
  }
}
