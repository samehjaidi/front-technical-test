
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { FileItem } from '../models/file-item'

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = 'http://localhost:3001/api/items';

  constructor(private http: HttpClient) { }

  loadItems(parentId: string | null = null): Observable<FileItem[]> {
    let params = new HttpParams();
    if (parentId) {
      params = params.set('parentId', parentId);
    }
    return this.http.get<{ items: FileItem[] }>(this.apiUrl, { params })
      .pipe(map(response => response.items));
  }
  createFolder(name: string, parentId: string | null): Observable<FileItem> {
    const body = { name, folder: true, parentId };
    return this.http.post<FileItem>(this.apiUrl, body);
  }
  uploadFiles(formData: FormData, parentId: string | null): Observable<any> {
    if (parentId) formData.append('parentId', parentId);
    return this.http.post(this.apiUrl, formData, { observe: 'response' });
  }
  downloadFile(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}`, { responseType: 'blob' });
  }
}
