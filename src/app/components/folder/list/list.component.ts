import { Component, OnInit } from '@angular/core';
import { FileService } from '../../../services/file.service';
import { FileItem } from '../../../models/file-item';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharedModules } from '../../../shared/shared-module';
import { EditItemComponent } from '../../modal/edit-item/edit-item.component';

@Component({
  selector: 'ic-list',
    standalone: true,
  imports: [ FormsModule, SharedModules],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  folders: FileItem[] = [];
 constructor(
    private fileService: FileService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadFolders();
  }

  loadFolders() {
    this.fileService.loadItems(null).subscribe((items) => {
      this.folders = items.filter(i => i.folder);
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

}