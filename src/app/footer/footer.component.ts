import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
  emailstring=
  "mailto:reservas@hostalibizatalca.cl?Subject=Reserva&body=Hola,%20me%20gustaría%20consultar%20sobre%20disponibilidad," + 
  "%20precios%20o%20realizar%20una%20reserva.";
}
