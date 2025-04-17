import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MockBackendService } from '../../services/mock-backend.service';
import { Item } from '../../models/item.model';
import { ItemCardComponent } from '../item-card/item-card.component';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatProgressSpinnerModule, ItemCardComponent],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.scss'
})
export class ItemListComponent {
  private backend = inject(MockBackendService);

  readonly loading = signal(true);
  readonly items = signal<Item[]>([]);

  readonly activeItems = computed(() =>
    this.items().filter(item => item.isActive)
  );

  constructor() {
    this.loadItems();
  }

  private async loadItems() {
    this.loading.set(true);
    const items = await this.backend.getItems();
    this.items.set(items);
    this.loading.set(false);
  }
}
