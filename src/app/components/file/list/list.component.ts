import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { SharedModules } from '../../../shared/shared-module';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '../../../services/file.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileItem } from '../../../models/file-item';
import { MatDialog } from '@angular/material/dialog';

import { Location } from "@angular/common";
import { EditItemComponent } from '../../modal/edit-item/edit-item.component';
import { SwalService } from '../../../services/swal.service';
import { MoveItemComponent } from '../../../models/move-item/move-item.component';
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'application/pdf'
];
@Component({
  selector: 'ic-list',
  standalone: true,
  imports: [SharedModules],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})


export class ListComponent {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  items$!: Observable<FileItem[]>;
  currentParentId: string | null = null;
  @Input() folderId!: string;
  allowedFileTypes = ALLOWED_FILE_TYPES;

  isUploading = false;
  fileUrl!: string | null;
  uploadFile!: File | null;

  constructor(
    private fileService: FileService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private swalService: SwalService,
    private location: Location,

  ) { }

  ngOnInit() {
    const folderIdFromRoute = this.route.snapshot.params['id'];
    this.currentParentId = this.folderId || folderIdFromRoute;
    this.loadItems(this.currentParentId);
  }

  goBack() {
    this.location.back();
  }

  loadItems(parentId: string | null) {
    this.items$ = this.fileService.loadItems(parentId);
  }
  handleChange(event: any) {
    const file = event.target.files[0] as File;
    this.fileUrl = URL.createObjectURL(file);
    this.uploadFile = file;
  }
  onUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const formData = new FormData();
      Array.from(input.files).forEach(file => formData.append('files', file));

      this.fileService.uploadFiles(formData, this.currentParentId).subscribe({
        next: res => {
          if (res.status === 207 && res.body?.failed) {
            res.body.failed.forEach((fail: any) => {
              this.snackBar.open(`Failed to upload ${fail.filename}: ${fail.message}`, 'Close');
            });
          }
          this.loadItems(this.currentParentId);
        },
        error: err => {
          if (err.error?.errors) {
            err.error.errors.forEach((fail: any) => {
              this.snackBar.open(`Failed to upload ${fail.filename}: ${fail.message}`, 'Close');
            });
          } else {
            this.snackBar.open(err.error?.desc || err.message, 'Close');
          }
        }
      });
    }
  }

  onRename(item: FileItem) {
    const dialogRef = this.dialog.open(EditItemComponent, {
      data: { mode: 'edit', name: item.name, type: item.folder ? 'folder' : 'file' }
    });

    dialogRef.afterClosed().subscribe(newName => {
      if (newName && newName !== item.name) {
        this.fileService.renameItem(item.id, newName, this.currentParentId).subscribe({
          next: () => this.loadItems(this.currentParentId),
          error: err => this.snackBar.open(err.error?.desc || err.message, 'Close')
        });
      }
    });
  }


  onDelete(item: FileItem) {
    this.swalService.confirmAlert(
      'Delete File',
      `Are you sure you want to delete the file "${item.name}"?`,
      'Delete'
    ).then((result: any) => {
      if (result.isConfirmed) {
        this.fileService.deleteItem(item.id).subscribe({
          next: () => {
            this.loadItems(this.currentParentId);
            this.swalService.successAlert('Deleted!', `"${item.name}" has been deleted.`);
          },
          error: err => {
            this.swalService.errorAlert('Error', err.error?.desc || err.message);
          }
        });
      }
    });
  }

  onDownload(item: FileItem) {
    if (!item.folder) {
      this.fileService.downloadFile(item.id).subscribe({
        next: blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = item.name;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: err => this.snackBar.open(err.error?.desc || err.message, 'Close')
      });
    }
  }



  handleUploadFile() {
    if (!this.uploadFile) return;
    this.isUploading = true;

    const formData = new FormData();
    formData.append('files', this.uploadFile);

    this.fileService.uploadFiles(formData, this.currentParentId).subscribe({
      next: () => {
        this.isUploading = false;
        this.swalService.successAlert('Uploaded!', `"${this.uploadFile?.name}" has been uploaded.`);
        this.handleRemovesFile();
        this.uploadFile = null;

        this.loadItems(this.currentParentId);
      },
      error: err => {
        this.isUploading = false;
        this.swalService.errorAlert('Error', err.error?.desc || err.message);
      }
    });
  }

  handleRemovesFile() {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = null;
    }
  }
  onMove(item: FileItem) {
    const dialogRef = this.dialog.open(MoveItemComponent, { width: '400px', data: { currentItem: item } });

    dialogRef.afterClosed().subscribe(targetFolderId => {
      if (targetFolderId && targetFolderId !== item.parentId) {
        this.fileService.moveItem(item.id, item.parentId, targetFolderId).subscribe({
          next: () => this.loadItems(this.currentParentId),
          error: err => this.snackBar.open(err.error?.desc || err.message, 'Close')
        });
      }
    });
  }
}