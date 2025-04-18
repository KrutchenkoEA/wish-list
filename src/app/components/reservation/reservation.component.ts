import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Item } from '../../models/item.model';
import { MockBackendService } from '../../services/mock-backend.service';
import { FingerprintService } from '../../services/fingetprint.service';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReservationComponent implements OnInit {
  @Input() item!: Item;

  dialogRef = inject(MatDialogRef);
  private backend = inject(MockBackendService);
  private fingerprint = inject(FingerprintService);
  private snackBar = inject(MatSnackBar);

  storedName: string | null = null;

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  get nameControl() {
    return this.formGroup.controls.name;
  }

  async ngOnInit() {
    const deviceId = await this.fingerprint.getDeviceIdAsync();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.deviceId === deviceId);
    if (user) {
      this.storedName = user.lastName; // Подставляем имя пользователя, если оно есть
      this.nameControl.setValue(this.storedName);
    }
  }

  async reserve() {
    if (this.nameControl.invalid) return;

    const name = this.nameControl.value!;
    const deviceId = await this.fingerprint.getDeviceIdAsync();

    try {
      await this.backend.reserveItem(this.item.id, name, deviceId);
      this.snackBar.open('Подарок забронирован!', 'Закрыть', { duration: 3000 });
      this.dialogRef.close(true);
    } catch (err) {
      this.snackBar.open('Ошибка: Подарок уже забронирован.', 'Закрыть', { duration: 3000 });
    }
  }
}
