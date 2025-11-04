import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isScrolled = false;

  // Detecta si el usuario ha hecho scroll para cambiar el estilo del navbar
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 60;
  }

  // Desplazamiento suave hacia una sección
  scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId);
    if (section) {
      const offset = -80;
      setTimeout(() => {
        const elementPosition = section.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition + offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 10);
    }
  }
}
