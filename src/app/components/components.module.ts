import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from '../navbar/navbar.component';
import { PhotoGalleryComponent } from '../photo-gallery/photo-gallery.component';
import { FooterComponent } from '../footer/footer.component';
import { BeneficiosComponent } from '../beneficios/beneficios.component';


@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    PhotoGalleryComponent,
    BeneficiosComponent
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    PhotoGalleryComponent,
    BeneficiosComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule,
  ]
})
export class ComponentsModule { }
