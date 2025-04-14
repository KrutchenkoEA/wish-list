import { Component, inject, Signal, signal } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ItemCardComponent } from '../item-card/item-card.component';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    MatGridListModule,
    ItemCardComponent,
  ],
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
})
export class ItemListComponent {
  private itemService = inject(ItemService);
  private breakpoints = inject(BreakpointObserver);

  items = this.itemService.items; // Signal<Item[]>
  cols: Signal<number>;

  constructor() {
    this.cols = signal(3);
    this.breakpoints.observe([Breakpoints.Handset]).subscribe(result => {
      this.cols.set(result.matches ? 1 : 3);
    });
  }
}
