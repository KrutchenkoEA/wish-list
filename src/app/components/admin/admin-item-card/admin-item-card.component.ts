import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Item } from '../../../models/item.model';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChip } from '@angular/material/chips';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-admin-item-card',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDialogModule, MatChip, CdkDrag, CdkDragHandle],
  templateUrl: './admin-item-card.component.html',
  standalone: true,
  styleUrl: './admin-item-card.component.scss',
})
export class AdminItemCardComponent {
  @Input() item!: Item;
  @Output() openEditDialog = new EventEmitter<Item>();
  @Output() deleteItem = new EventEmitter<string>();
  @Output() cancelReservation = new EventEmitter<Item>();
}
