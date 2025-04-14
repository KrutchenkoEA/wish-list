import { Component, inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FingerprintService } from '../../services/fingerprint.service';
import { DeviceInfo } from '../../services/fingerprint.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-booking-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './booking-dialog.component.html',
})
export class BookingDialogComponent implements OnInit {
  nameControl = new FormControl('', [Validators.required]);
  deviceInfo: DeviceInfo | null = null;

  private fingerprintService = inject(FingerprintService);
  private dialogRef = inject(MatDialogRef<BookingDialogComponent>);

  async ngOnInit() {
    this.deviceInfo = await this.fingerprintService.getDeviceInfo();

    // Предугадывание имени из localStorage
    const savedName = localStorage.getItem('wishlistName');
    if (savedName) {
      this.nameControl.setValue(savedName);
    }
  }

  confirm() {
    if (this.nameControl.invalid || !this.deviceInfo) return;

    const name = this.nameControl.value!;
    localStorage.setItem('wishlistName', name);

    this.dialogRef.close({
      name,
      device: this.deviceInfo,
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
