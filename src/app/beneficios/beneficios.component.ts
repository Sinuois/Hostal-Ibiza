// src/app/beneficios/beneficios.component.ts

import { Component } from '@angular/core';

interface Beneficio {
  icono: string;
  titulo: string;
  descripcion: string;
}

@Component({
  selector: 'app-beneficios',
  templateUrl: './beneficios.component.html',
  styleUrls: ['./beneficios.component.css']
})
export class BeneficiosComponent {

  beneficios: Beneficio[] = [
    {
      icono: 'bi-cash-stack',
      titulo: 'Precio Sin Comisiones',
      descripcion: 'Te garantizamos el mejor precio si reservas con nosotros, sin comisiones adicionales.'
    },
    {
      icono: 'bi-building',
      titulo: 'Distintas Habitaciones',
      descripcion: 'Para viajeros, parejas, familias o grupos, con baños privados o compartidos, según tu preferencia.'
    },
    {
      icono: 'bi-geo-alt-fill',
      titulo: 'Ubicación Privilegiada',
      descripcion: 'En el corazón de Talca, cerca del centro, mall y principales rutas de la ciudad.'
    },
    {
      icono: 'bi-car-front-fill',
      titulo: 'Estacionamiento',
      descripcion: 'Por favor, consulta por la disponibilidad y el valor de este servicio al momento de reservar.'
    }
  ];

}