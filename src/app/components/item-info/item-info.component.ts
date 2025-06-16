import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { COMMON_ID } from '../../const/list.const';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-item-info',
  imports: [
    MatButton,
  ],
  templateUrl: './item-info.component.html',
  styleUrl: './item-info.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('expandCollapse', [
      state('expanded', style({ height: '*', opacity: 1 })),
      state('collapsed', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      transition('expanded <=> collapsed', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class ItemInfoComponent {
  rulesCollapsed = localStorage.getItem('wishlist_rulesCollapsed') === 'true';
  router = inject(Router);

  toggleRules(): void {
    this.rulesCollapsed = !this.rulesCollapsed;
    localStorage.setItem('wishlist_rulesCollapsed', this.rulesCollapsed.toString());
  }

  public isActive(): boolean {
    return this.router.isActive(`list/${COMMON_ID.route}`, {
      queryParams: 'exact',
      paths: 'exact',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }
}
