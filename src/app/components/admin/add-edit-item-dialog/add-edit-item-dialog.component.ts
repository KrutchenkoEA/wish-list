// src/app/features/admin-panel/dialogs/add-edit-item-dialog.component.ts
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Item } from '../../../models/item.model';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-add-edit-item-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckbox,
  ],
  templateUrl: './add-edit-item-dialog.component.html',
  styleUrl: './add-edit-item-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditItemDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Item | null,
  ) {

    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      link: [''],
      isActive: [true],
    });
    if (data) {
      this.form.patchValue({
        title: data.title,
        description: data.description,
        link: data.link,
        isActive: data.isActive ?? true,
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;
    const updated: Item = {
      ...this.data,
      ...this.form.value,
      isActive: true,
      reservedBy: this.data?.reservedBy ?? null,
      id: this.data?.id ?? crypto.randomUUID(),
    };
    this.dialogRef.close(updated);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
