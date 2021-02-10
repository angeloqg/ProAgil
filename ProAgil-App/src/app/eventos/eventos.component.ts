import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/EventoService';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  eventosFiltrados: Evento[];
  eventos: Evento[];
  modalRef: any;

  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;

  private filtro = '';

  public get filtroLista(): string {
    return this.filtro;
  }
  public set filtroLista(value: string) {
    this.filtro = value;
  }


  constructor(private eventoService: EventoService
            , private modalService: BsModalService
            ) {
    this.eventosFiltrados = [];
    this.eventos = [];
  }

  openModal(template: TemplateRef<any>): void{
    this.modalRef = this.modalService.show(template);
  }

  ngOnInit(): any {
    this.getEventos();
  }

  alternarImagem(): any {
    this.mostrarImagem = !this.mostrarImagem;
  }

  getEventos(): void{
    this.eventoService.getAllEventos().subscribe( (evt: Evento[]) => {
      this.eventos = evt;
      this.eventosFiltrados = this.eventos;
      console.log(evt);
    }, error => {
      console.log(error);
    }

    );
  }

  filtrarEvento(): Evento[]{

    if ( this.filtroLista === '')
    {
      this.eventosFiltrados = this.eventos;
    }

    this.filtroLista = this.filtroLista.toLocaleLowerCase();
    const evt = JSON.parse(JSON.stringify(this.eventos));

    this.eventosFiltrados = [];
    for ( const valor of this.eventos){
      if ( valor.tema.toLocaleLowerCase().includes(this.filtroLista)){
        this.eventosFiltrados.push(valor);
      }
    }

    return this.eventosFiltrados;
  }

  limparBusca(): Evento[]{
    this.filtroLista = '';
    this.eventosFiltrados = this.eventos;
    return this.eventosFiltrados;
  }
}
