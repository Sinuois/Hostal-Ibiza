import { HttpClient } from '@angular/common/http';
import { Component, OnInit, HostListener } from '@angular/core';

declare var window: any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  emisor: string = '';
  comentario: string = '';
  botonDeshabilitado = true; 

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Permite que los iframes (mapas, formularios) se ajusten automáticamente
    window.resizeIframe = (iframe: any) => {
      iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 'px';
    };

    // Ejecutar la animación de aparición al cargar
    this.animateSections();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.animateSections();
  }

  /** Animación para que las secciones aparezcan suavemente al hacer scroll */
  animateSections() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0 && !section.classList.contains('visible')) {
        section.classList.add('visible');
      }
    });
  }

  /** Habilita o deshabilita el botón según los campos */
  verificarCampos(): void {
    this.botonDeshabilitado = !(this.emisor.trim() && this.comentario.trim());
  }

  /** Enviar mensaje de contacto al bot de Telegram */
  enviarComentario() {
    const botToken = '8341668092:AAFCBtPNpf95zWPpj2wjMdqfpQCPCRdiYPE';
    const chatId = '-1003191266957';
    const mensaje = `📩 Nuevo mensaje de contacto:\n\n👤 De: ${this.emisor}\n💬 Mensaje: ${this.comentario}`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const payload = { chat_id: chatId, text: mensaje };

    if (this.emisor === '' || this.comentario === '') {
      alert('Por favor, completa todos los campos antes de enviar.');
      return;
    }

    this.botonDeshabilitado = true;

    this.http.post(url, payload).subscribe(
      () => {
        alert('✅ Mensaje enviado correctamente. ¡Gracias por contactarnos!');
        this.comentario = ''; 
        this.emisor = ''; 
        this.botonDeshabilitado = true; 
      },
      error => {
        console.error(error);
        alert('❌ Hubo un error al enviar el mensaje. Intenta nuevamente más tarde.');
        this.botonDeshabilitado = false;
      }
    );
  }
}
