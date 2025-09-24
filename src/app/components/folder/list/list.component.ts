import { Component, OnInit } from '@angular/core';
import { FileService } from '../../../services/file.service';
import { FileItem } from '../../../models/file-item';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharedModules } from '../../../shared/shared-module';
import { EditItemComponent } from '../../modal/edit-item/edit-item.component';
import { SwalService } from '../../../services/swal.service';

@Component({
  selector: 'ic-list',
  standalone: true,
  imports: [FormsModule, SharedModules],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  folders: FileItem[] = [];
  items: FileItem[] = [];
  constructor(
    private fileService: FileService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private swalService: SwalService,) { }


  ngOnInit() {
    this.loadFolders();
  }

  loadFolders() {
    this.fileService.loadItems(null).subscribe((items) => {
      this.items = items;
      this.folders = items.filter(i => i.folder);
      console.log('folders', this.folders);
      console.log('all items', this.items);
    });
  }
  onCreateFolder() {
    const dialogRef = this.dialog.open(EditItemComponent, {
      width: '30%',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(name => {
      if (name) {
        this.fileService.createFolder(name, null).subscribe({
          next: () => this.loadFolders(),
          error: err => this.snackBar.open(err.error?.desc || err.message, 'Close')
        });
      }
    });
  }
  onFolderClick(folder: FileItem) {
    this.router.navigate(['/folders', folder.id]);
  }

  onDelete(item: FileItem) {
    this.swalService.confirmAlert(
      'Delete Folder',
      `Are you sure you want to delete the folder "${item.name}"?`,
      'Delete'
    ).then((result: any) => {
      if (result.isConfirmed) {
        this.fileService.deleteItem(item.id).subscribe({
          next: () => {
            this.loadFolders();
            this.swalService.successAlert('Deleted!', `"${item.name}" has been deleted.`);
          },
          error: err => {
            this.swalService.errorAlert('Error', err.error?.desc || err.message);
          }
        });
      }
    });
  }

  onRename(folder: FileItem) {
    const dialogRef = this.dialog.open(EditItemComponent, {
      width: '30%',
      data: { mode: 'edit', name: folder.name }
    });

    dialogRef.afterClosed().subscribe(newName => {
      if (newName && newName !== folder.name) {
        this.fileService.renameItem(folder.id, newName).subscribe({
          next: () => this.loadFolders(),
          error: err => this.snackBar.open(err.error?.desc || err.message, 'Close')
        });
      }
    });
  }

  getFilesCount(folderId: string): number {
    return this.items.filter(item => item.parentId === folderId && !item.folder).length;
  }

  onViewFiles(folder: FileItem) {
    this.router.navigate(['/folders', folder.id]);
  }

}