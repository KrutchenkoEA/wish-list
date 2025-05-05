import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Item } from '../../../models/item.model';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChip } from '@angular/material/chips';

@Component({
  selector: 'app-admin-item-card',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDialogModule, MatChip],
  templateUrl: './admin-item-card.component.html',
  standalone: true,
  styleUrl: './admin-item-card.component.scss',
})
export class AdminItemCardComponent {
  @Input() item!: Item;
  @Output() openEditDialog = new EventEmitter<Item>();
  @Output() deleteItem = new EventEmitter<string>();
  @Output() cancelReservation = new EventEmitter<Item>();

  private _expanded!: boolean;
  public cardExpanded!: boolean;

  @Input('expanded') set expanded(value: boolean) {
    this._expanded = value;
    this.cardExpanded = value;
  }

  get expanded() {
    return this._expanded;
  }

  expand(): void {
    if (!this.expanded) {
      this.cardExpanded = !this.cardExpanded;
    }
  }
}
