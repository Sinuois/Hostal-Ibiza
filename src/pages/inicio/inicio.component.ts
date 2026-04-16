import { HttpClient } from '@angular/common/http';
import { Component, OnInit, HostListener, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { environment } from '../../environments/environment';

declare var window: any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit, AfterViewInit {

  @ViewChild('bgVideo') bgVideo!: ElementRef<HTMLVideoElement>;

  readonly primaryVideoSource = 'assets/videos/presentacion-cut.mp4';
  readonly fallbackVideoSource = 'https://hostal-ibiza-3d2e6.web.app/assets/videos/presentacion-cut.mp4';
  videoSource = this.primaryVideoSource;
  private usingFallbackSource = false;

  emisor: string = '';
  comentario: string = '';
  botonDeshabilitado = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.setInitialVideoSource();

    // Permite que los iframes (mapas, formularios) se ajusten automáticamente
    window.resizeIframe = (iframe: any) => {
      iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 'px';
    };

    // Ejecutar animación de aparición al cargar
    this.animateSections();
  }

  ngAfterViewInit(): void {
    this.reloadAndPlayVideo();
  }

  private setInitialVideoSource(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const hostname = window.location?.hostname?.toLowerCase() || '';
    if (hostname.endsWith('hostalibizatalca.cl')) {
      this.videoSource = this.fallbackVideoSource;
      this.usingFallbackSource = true;
    }
  }

  private reloadAndPlayVideo(): void {
    const video = this.bgVideo?.nativeElement;
    if (!video) {
      return;
    }

    video.muted = true;
    video.load();

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        setTimeout(() => {
          video.play().catch(() => {
            // El navegador puede bloquear autoplay en algunos escenarios.
          });
        }, 500);
      });
    }
  }

  onVideoError(): void {
    if (this.usingFallbackSource) {
      return;
    }

    this.videoSource = this.fallbackVideoSource;
    this.usingFallbackSource = true;

    setTimeout(() => this.reloadAndPlayVideo(), 0);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.animateSections();
  }

  // Animación para que las secciones aparezcan suavemente al hacer scroll
  animateSections() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0 && !section.classList.contains('visible')) {
        section.classList.add('visible');
      }
    });
  }

  // Habilita o deshabilita el botón según los campos
  verificarCampos(): void {
    this.botonDeshabilitado = !(this.emisor.trim() && this.comentario.trim());
  }

  mensaje: string = "";

  placeholderMensaje: string = 
    "Hola, me gustaría consultar sobre disponibilidad, precios o realizar una reserva.";

  getTextoFinal(): string {
    return this.mensaje?.trim() ? this.mensaje : this.placeholderMensaje;
  }

  enviarWhatsApp() {
    const numero = "56990327387";
    const texto = encodeURIComponent(this.getTextoFinal());
    window.open(`https://wa.me/${numero}?text=${texto}`, "_blank");
  }

  enviarCorreo() {
    const correo = "reservas@hostalibizatalca.cl";
    const asunto = encodeURIComponent("Consulta / Reserva - Hostal Ibiza");
    const cuerpo = encodeURIComponent(this.getTextoFinal());
    window.location.href = `mailto:${correo}?subject=${asunto}&body=${cuerpo}`;
  }

}
