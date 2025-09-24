import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileService } from '../../services/file.service';
import { FileItem } from '../../models/file-item';
import { Observable } from 'rxjs';
import { map, } from 'rxjs/operators';
import { SharedModules } from '../../shared/shared-module';


@Component({
  selector: 'ic-move-item',
  imports: [SharedModules],
  templateUrl: './move-item.component.html',
  styleUrl: './move-item.component.scss'
})
export class MoveItemComponent {
  folders$!: Observable<FileItem[]>;
  selectedFolderId: string | null = null;

  constructor(
    private fileService: FileService,
    public dialogRef: MatDialogRef<MoveItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentItem: FileItem }
  ) { }

  ngOnInit(): void {
    this.folders$ = this.fileService.loadItems(null).pipe(
      map((items: FileItem[]) =>
        items.filter(i => i.folder && i.id !== this.data.currentItem.id)
      )
    );
  }

  selectFolder(folder: FileItem) {
    this.selectedFolderId = folder.id;
  }

  move() {
    this.dialogRef.close(this.selectedFolderId);
  }
}
