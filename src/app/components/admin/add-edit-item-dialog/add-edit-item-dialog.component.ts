// src/app/features/admin-panel/dialogs/add-edit-item-dialog.component.ts
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
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
export class AddEditItemDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject<MatDialogRef<AddEditItemDialogComponent>>(MatDialogRef);

  data = inject<Item | null>(MAT_DIALOG_DATA);
  form: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      link: [''],
      isActive: [true],
    });
    if (this.data) {
      this.form.patchValue({
        title: this.data.title,
        description: this.data.description,
        link: this.data.link,
        isActive: this.data.isActive ?? true,
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;
    const updated: Item = {
      ...this.data,
      ...this.form.value,
      reservedBy: this.data?.reservedBy ?? null,
      id: this.data?.id ?? crypto.randomUUID(),
    };
    this.dialogRef.close(updated);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
