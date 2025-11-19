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

  // Obtener imágenes y videos dentro de una subcarpeta
  getMediaFromFolder(folderId: string, numItems: number, pageToken: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('key', this.apiKey)
      .set('pageSize', numItems.toString())
      .set('fields', 'nextPageToken, files(id, name, mimeType)')
      .set('q', `'${folderId}' in parents and (mimeType contains 'image/' or mimeType contains 'video/')`);

    if (pageToken) params = params.set('pageToken', pageToken);

    return this.http.get(this.apiUrl, { params }).pipe(
      switchMap((response: any) => {
        if (!response.nextPageToken) {
          return new Observable((obs) => {
            obs.next({
              nextPageToken: null,
              files: this.mapMediaFiles(response.files || [])
            });
            obs.complete();
          });
        }
        return this.http.get(this.apiUrl, {
          params: params.set('pageToken', response.nextPageToken)
        }).pipe(
          map((nextPage: any) => {
            const validNextFiles = (nextPage.files || []).filter((f: { mimeType: string | string[]; }) =>
              f.mimeType.includes('image/') || f.mimeType.includes('video/')
            );
            return {
              nextPageToken: validNextFiles.length > 0 ? response.nextPageToken : null,
              files: this.mapMediaFiles(response.files || [])
            };
          })
        );
      })
    );
  }

  private mapMediaFiles(files: any[]) {
    return files.map((file: any) => {
      const isVideo = file.mimeType.includes('video/');
      return {
        ...file,
        isVideo,
        thumbnailLink: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`,
        videoLink: isVideo ? `https://drive.google.com/file/d/${file.id}/preview` : null
      };
    });
  }



  // Obtener todas las secciones (subcarpetas + contenido inicial)
  getAllSections(rootFolderId: string, numItems: number): Observable<any[]> {
    return this.getSubfolders(rootFolderId).pipe(
      switchMap((folders) => {
        if (!folders.length) return new Observable<any[]>((observer) => {
          observer.next([]);
          observer.complete();
        });
        const observables = folders.map((folder: any) =>
          this.getMediaFromFolder(folder.id, numItems).pipe(
            map((mediaResponse) => ({
              id: folder.id,
              name: folder.name,
              photos: mediaResponse.files,
              nextPageToken: mediaResponse.nextPageToken,
            }))
          )
        );
        return forkJoin(observables);
      })
    );
  }
}
