
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModules } from "../../../shared/shared-module";

@Component({
  selector: 'ic-edit-item',
  imports: [SharedModules],
  templateUrl: './edit-item.component.html',
  styleUrl: './edit-item.component.scss'
})
export class EditItemComponent {
 form: FormGroup;
  title: string;
  placeholder: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      name?: string;
      mode: 'edit' | 'create';
      type?: 'folder' | 'file';
    }
  ) {
    this.form = this.fb.group({
      name: [data.name || '', Validators.required],
    });

    if (data.mode === 'edit') {
      this.title = data.type === 'file' ? 'Rename File' : 'Rename Folder';
      this.placeholder = 'Enter new name';
    } else {
      this.title = 'Create Folder';
      this.placeholder = 'Enter folder name';
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.name);
    }
  }
}

