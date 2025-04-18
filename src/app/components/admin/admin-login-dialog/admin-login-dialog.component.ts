import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-login-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogActions,
    MatDialogContent, MatDialogTitle, NgIf,
  ],
  templateUrl: './admin-login-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLoginDialogComponent {
  dialogRef = inject(MatDialogRef<AdminLoginDialogComponent>);

  formGroup = new FormGroup({
    password: new FormControl('', [Validators.required]),
  });

  get passwordControl() {
    return this.formGroup.controls.password;
  }

  submit(): void {
    this.dialogRef.close(this.passwordControl.value);
  }
}
