import { ChangeDetectionStrategy, Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Item } from '../../../models/item.model';
import { FingerprintService } from '../../../services/fingetprint.service';
import { FirebaseService } from '../../../services/firebase.service';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationComponent implements OnInit {
  item!: Item;
  collectionId!: string;

  dialogRef = inject<MatDialogRef<ReservationComponent>>(MatDialogRef);
  private backend = inject(FirebaseService);
  private fingerprint = inject(FingerprintService);
  private snackBar = inject(MatSnackBar);

  storedName: string | null = null;

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  get nameControl() {
    return this.formGroup.controls.name;
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: { item: Item; collectionId?: string } | null) {
    this.item = data.item;
    this.collectionId = data?.collectionId ?? this.item.collectionId ?? 'common';
  }

  ngOnInit(): void {
    const deviceId = this.fingerprint.getDeviceId();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.deviceId === deviceId);
    if (user) {
      this.storedName = user.lastName; // Подставляем имя пользователя, если оно есть
      this.nameControl.setValue(this.storedName);
    }
  }

  reserve(): void {
    if (this.nameControl.invalid) return;

    const name = this.nameControl.value!;
    const deviceId = this.fingerprint.getDeviceId();

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUserIndex = users.findIndex((u: any) => u.deviceId === deviceId);

    if (existingUserIndex !== -1) {
      users[existingUserIndex].lastName = name;
    } else {
      users.push({ deviceId, lastName: name });
    }

    localStorage.setItem('users', JSON.stringify(users));

    this.backend.reserveItem(this.item.id, name, deviceId, this.collectionId).pipe().subscribe({
      next: () => {
        this.snackBar.open('Подарок забронирован!', 'Закрыть', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('Ошибка: Подарок уже забронирован.', 'Закрыть', { duration: 3000 });
      },
    });
  }
}
