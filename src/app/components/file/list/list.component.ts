import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { SharedModules } from '../../../shared/shared-module';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '../../../services/file.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileItem } from '../../../models/file-item';

@Component({
  selector: 'ic-list',
    standalone: true,
  imports: [ SharedModules],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
    @Input() folderId!: string;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  items$!: Observable<FileItem[]>;
  currentParentId: string | null = null;

  constructor(
    private fileService: FileService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) { }
  ngOnInit() {
    const folderIdFromRoute = this.route.snapshot.params['id'];
    this.currentParentId = this.folderId || folderIdFromRoute;
    this.loadItems(this.currentParentId);
  }
  loadItems(parentId: string | null) {
    this.items$ = this.fileService.loadItems(parentId);
  }
  onUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      console.log(`Uploading ${input.files.length} file(s) to folder:`, this.currentParentId);
      const formData = new FormData();
      Array.from(input.files).forEach(file => formData.append('files', file));

      this.fileService.uploadFiles(formData, this.currentParentId).subscribe({
        next: (res) => {
          console.log('Upload response:', res);
          if (res.status === 207) {
            res.body.failed.forEach((fail: any) => {
              this.snackBar.open(`Failed to upload ${fail.filename}: ${fail.message}`, 'Close', { duration: 5000 });
            });
          }
          this.loadItems(this.currentParentId);
        },
     
      });
    }
  }





    onDownload(item: FileItem) {
    if (!item.folder) {
      console.log('Downloading file:', item);
      this.fileService.downloadFile(item.id).subscribe({
        next: blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = item.name;
          a.click();
          window.URL.revokeObjectURL(url);
        },
    
      });
    }
  }

}
