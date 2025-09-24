import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileService } from '../../../services/file.service';
import { BehaviorSubject, map } from 'rxjs';
import { ListComponent } from '../../file/list/list.component';
import { SharedModules } from '../../../shared/shared-module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ic-details',
  imports: [CommonModule, ListComponent, SharedModules],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  folderId!: string;
  folderName$ = new BehaviorSubject<string | null>(null);

  constructor(private route: ActivatedRoute,
    private fileService: FileService,
) { }

  ngOnInit() {
    this.folderId = this.route.snapshot.params['id'];

    this.fileService.loadItems(null).subscribe(items => {
      const folder = items.find(i => i.id === this.folderId);
      this.folderName$.next(folder ? folder.name : this.folderId);
    });
  }
}
