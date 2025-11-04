import { Component, OnInit } from '@angular/core';
import { GoogleDriveService } from '../services/drive.service';

interface Photo {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink: string;
}

@Component({
  selector: 'app-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.css']
})
export class PhotoGalleryComponent implements OnInit {
  fotosHabitaciones: Photo[] = [];
  fotosAreasComunes: Photo[] = [];
  nextPageTokenHabitaciones?: string;
  nextPageTokenAreasComunes?: string;
  habilitado = true;

  constructor(private googleDriveService: GoogleDriveService) {}

  ngOnInit() {
    this.loadHabitaciones(3);
    this.loadAreasComunes(3);
  }

  loadHabitaciones(numFotos: number) {
    this.googleDriveService.getFotosHabitaciones(this.nextPageTokenHabitaciones, numFotos).subscribe((response: any) => {
      this.fotosHabitaciones = [...this.fotosHabitaciones, ...response.files];
      this.nextPageTokenHabitaciones = response.nextPageTokenHabitaciones || undefined;
      this.habilitado = true;
    });
  }

  loadAreasComunes(numFotos: number) {
    this.googleDriveService.getFotosAreasComunes(this.nextPageTokenAreasComunes, numFotos).subscribe((response: any) => {
      this.fotosAreasComunes = [...this.fotosAreasComunes, ...response.files];
      this.nextPageTokenAreasComunes = response.nextPageTokenAreasComunes || undefined;
      this.habilitado = true;
    });
  }

  loadMoreHabitaciones() {
    this.habilitado = false;
    this.loadHabitaciones(4);
  }

  loadMoreAreasComunes() {
    this.habilitado = false;
    this.loadAreasComunes(4);
  }
}
