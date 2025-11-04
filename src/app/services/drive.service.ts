import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, numberAttribute } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoogleDriveService {
  private apiUrl = 'https://www.googleapis.com/drive/v3/files';
  private apiKey = 'AIzaSyDlZ7HhB3gMayC3ge_XgAYbtgSHDf_zf1A';
  private pageSize = 4;

  private folderIds = {
    habitaciones: "1dc9aJXQQWiH2RR4mPeJvvmLDGH4pOj9F",
    areasComunes: "1cvSfelQzaKbf-w3iyOPH1WEpflu6-4H8"
  };

  constructor(private http: HttpClient) {}

  private obtenerParametros(folderId: string, pageToken: string = '', numFotos: number) {
    let params = new HttpParams()
      .set('key', this.apiKey)
      .set('pageSize', numFotos.toString())
      .set('fields', 'nextPageToken, files(id, name, mimeType)')
      .set('q', `'${folderId}' in parents and mimeType contains 'image/'`);

    if (pageToken) {
      params = params.set('pageToken', pageToken);
    }

    return params;
  }

  private obtenerFotosDeCarpeta(folderId: string, pageToken: string = '', nextPageTokenKey: string, numFotos: number) {
    const params = this.obtenerParametros(folderId, pageToken, numFotos);
    console.log(params);
    return this.http.get(this.apiUrl, { params }).pipe(
      map((response: any) => {
        return {
          [nextPageTokenKey]: response.nextPageToken,
          files: response.files.map((file: any) => ({
            ...file,
            thumbnailLink: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`
          }))
        };
      })
    );
  }

  getFotosHabitaciones(pageToken: string = '', numFotos: number) {
    const folderId = this.folderIds.habitaciones;
    return this.obtenerFotosDeCarpeta(folderId, pageToken, 'nextPageTokenHabitaciones', numFotos);
  }


  getFotosAreasComunes(pageToken: string = '', numFotos: number) {
    const folderId = this.folderIds.areasComunes;
    return this.obtenerFotosDeCarpeta(folderId, pageToken, 'nextPageTokenAreasComunes', numFotos);
  }
}
