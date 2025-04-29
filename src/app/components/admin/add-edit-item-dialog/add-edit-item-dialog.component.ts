import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Item } from '../../../models/item.model';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    MatProgressBar,
  ],
  templateUrl: './add-edit-item-dialog.component.html',
  styleUrl: './add-edit-item-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditItemDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private dialogRef = inject<MatDialogRef<AddEditItemDialogComponent>>(MatDialogRef);

  data = inject<Item | null>(MAT_DIALOG_DATA);
  form: FormGroup;
  uploading = false;

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      link: [''],
      isActive: [true],
      imageData: [''],
      sortOrder: [0],
    });
    if (this.data) {
      this.form.patchValue({
        title: this.data.title,
        description: this.data.description,
        link: this.data.link,
        isActive: this.data.isActive ?? true,
        imageData: this.data.imageData,
        sortOrder: this.data?.sortOrder ?? null,
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

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.snackBar.open('Разрешены только JPEG, PNG и WebP!', 'Ок', { duration: 3000 });
      return;
    }
    this.uploading = true;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = async () => {
        const MAX_WIDTH = 800;
        const MAX_SIZE = 1 * 1024 * 1024; // 1MB

        const scaleFactor = MAX_WIDTH / img.width;
        const width = Math.min(img.width, MAX_WIDTH);
        const height = img.height * scaleFactor;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          this.uploading = false;
          this.cdr.markForCheck();
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.9;
        let compressedBase64 = '';
        let byteLength = Infinity;

        while (quality >= 0.3) {
          compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          byteLength = Math.ceil((compressedBase64.length * 3) / 4); // base64 to bytes estimate

          if (byteLength <= MAX_SIZE) break;
          quality -= 0.1;
        }

        if (byteLength > MAX_SIZE) {
          this.snackBar.open('Не удалось сжать изображение до 1MB 😢', 'Ок', { duration: 4000 });
          return;
        }

        this.form.patchValue({ imageData: compressedBase64 });
        this.uploading = false;
        this.snackBar.open('Изображение сжато и добавлено!', 'Ок', { duration: 2000 });
        this.cdr.markForCheck();
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.form.patchValue({ imageData: null });
  }
}
