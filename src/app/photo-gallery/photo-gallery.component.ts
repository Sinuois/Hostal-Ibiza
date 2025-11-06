import { Component, OnInit } from '@angular/core';
import { GoogleDriveService } from '../services/drive.service';
import { environment } from '../../environments/environment';

interface Section {
  id: string;
  name: string;
  photos: any[];
  nextPageToken?: string;
}

@Component({
  selector: 'app-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.css']
})
export class PhotoGalleryComponent implements OnInit {
  sections: Section[] = [];
  rootFolderId = environment.googleDrive.rootFolderId;
  habilitado = true;

  constructor(private driveService: GoogleDriveService) {}

  ngOnInit() {
    this.driveService.getAllSections(this.rootFolderId, 2).subscribe((sections: any[]) => {
      this.sections = sections;
    });
  }

  loadMore(section: Section) {
    this.habilitado = false;
    this.driveService
      .getPhotosFromFolder(section.id, 4, section.nextPageToken)
      .subscribe((response) => {
        section.photos = [...section.photos, ...response.files];
        section.nextPageToken = response.nextPageToken;
        this.habilitado = true;
      });
  }
}
