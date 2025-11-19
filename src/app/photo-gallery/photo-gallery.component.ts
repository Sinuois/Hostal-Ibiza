import { Component, OnInit } from '@angular/core';
import { GoogleDriveService } from '../services/drive.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

interface MediaItem {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  videoLink?: SafeResourceUrl | null;
  isVideo?: boolean;
}

interface Section {
  id: string;
  name: string;
  photos: MediaItem[];
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

  constructor(
    private driveService: GoogleDriveService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.driveService.getAllSections(this.rootFolderId, 2).subscribe((sections: any[]) => {
      this.sections = sections.map((section: any) => ({
        ...section,
        photos: section.photos.map((item: any): MediaItem => ({
          ...item,
          videoLink: item.isVideo
            ? this.sanitizer.bypassSecurityTrustResourceUrl(item.videoLink)
            : null
        }))
      }));
    });
  }

  loadMore(section: Section) {
    this.habilitado = false;
    this.driveService
      .getMediaFromFolder(section.id, 4, section.nextPageToken)
      .subscribe((response: any) => {
        const sanitizedFiles: MediaItem[] = response.files.map((item: any): MediaItem => ({
          ...item,
          videoLink: item.isVideo
            ? this.sanitizer.bypassSecurityTrustResourceUrl(item.videoLink)
            : null
        }));

        section.photos = [...section.photos, ...sanitizedFiles];
        section.nextPageToken = response.nextPageToken;
        this.habilitado = true;
      });
  }
}
