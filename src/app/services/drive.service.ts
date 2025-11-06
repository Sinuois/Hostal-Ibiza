import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, switchMap, forkJoin, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoogleDriveService {
  private apiUrl = 'https://www.googleapis.com/drive/v3/files';
  private apiKey = environment.googleDrive.apiKey;

  constructor(private http: HttpClient) {}

  // Obtener subcarpetas dentro de una carpeta raíz
  getSubfolders(rootFolderId: string): Observable<any[]> {
    const params = new HttpParams()
      .set('key', this.apiKey)
      .set('fields', 'files(id, name, mimeType, createdTime)')
      .set('orderBy', 'name')
      .set('q', `'${rootFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder'`);

    return this.http.get(this.apiUrl, { params }).pipe(
      map((response: any) => {
        const regex = /^\s*\d+[\.\-\s]*\s*/; 
        return (response.files || []).map((folder: any) => ({
          ...folder,
          name: folder.name.replace(regex, '').trim(), 
        }));
      })
    );
  }


  // Obtener fotos dentro de una subcarpeta
  getPhotosFromFolder(folderId: string, numFotos: number, pageToken: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('key', this.apiKey)
      .set('pageSize', numFotos.toString())
      .set('fields', 'nextPageToken, files(id, name, mimeType)')
      .set('q', `'${folderId}' in parents and mimeType contains 'image/'`);

    if (pageToken) params = params.set('pageToken', pageToken);

    return this.http.get(this.apiUrl, { params }).pipe(
      map((response: any) => ({
        nextPageToken: response.nextPageToken,
        files: (response.files || []).map((file: any) => ({
          ...file,
          thumbnailLink: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`,
        })),
      }))
    );
  }

  // Obtener todas las secciones (subcarpetas + fotos iniciales)
  getAllSections(rootFolderId: string, numFotos: number): Observable<any[]> {
    return this.getSubfolders(rootFolderId).pipe(
      switchMap((folders) => {
        if (!folders.length) return [ [] ]; // no hay subcarpetas
        const observables = folders.map((folder: any) =>
          this.getPhotosFromFolder(folder.id, numFotos).pipe(
            map((photosResponse) => ({
              id: folder.id,
              name: folder.name,
              photos: photosResponse.files,
              nextPageToken: photosResponse.nextPageToken,
            }))
          )
        );
        return forkJoin(observables);
      })
    );
  }
}
