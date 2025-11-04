import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from '../navbar/navbar.component';
import { PhotoGalleryComponent } from '../photo-gallery/photo-gallery.component';
import { CountdownComponent } from '../countdown/countdown.component';


@NgModule({
  declarations: [
    NavbarComponent,
    PhotoGalleryComponent,
    CountdownComponent
  ],
  exports: [
    NavbarComponent,
    PhotoGalleryComponent,
    CountdownComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule,
  ]
})
export class ComponentsModule { }
