import { Component, Input } from '@angular/core';
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
})
export class ItemCardComponent {
  @Input() item!: Item;

  constructor(private dialog: MatDialog) {
  }

  openReservationDialog() {
    this.dialog.open(ReservationComponent, {
      data: { item: this.item },
    });
  }
}
