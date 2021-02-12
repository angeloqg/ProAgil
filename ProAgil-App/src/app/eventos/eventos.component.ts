import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/EventoService';

import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
defineLocale('pt-br', ptBrLocale);

@Component({  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  eventosFiltrados: Evento[];
  eventos: Evento[];
  private evt: any;
  public get evento(): Evento {
    return this.evt;
  }
  public set evento(value: Evento) {
    this.evt = value;
  }

  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  registerForm: FormGroup;
  modoSalvar: string;
  bodyDeletarEvento = '';

  private filtro = '';

  public get filtroLista(): string {
    return this.filtro;
  }
  public set filtroLista(value: string) {
    this.filtro = value;
  }

  constructor(private eventoService: EventoService
            , private modalService: BsModalService
            , private formBuilder: FormBuilder
            , private localService: BsLocaleService
            ) {
    this.eventosFiltrados = [];
    this.eventos = [];

    this.modoSalvar = '';
    this.localService.use('pt-br');
    this.registerForm = formBuilder.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      imagemUrl: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

  }

 validation(campo: string, error: string = 'errors'): any{

  if (error === 'errors'){
    return this.registerForm.get(campo)?.errors;
  }

  if (error === 'touched'){
    return this.registerForm.get(campo)?.touched;
  }

  if (error === 'invalid'){
    return this.registerForm.get(campo)?.invalid;
  }

  if (error === 'dirty'){
    return this.registerForm.get(campo)?.dirty;
  }

  if (error === 'required'){
    return this.registerForm.get(campo)?.hasError('required');
  }

  if (error === 'maxLength'){
    return this.registerForm.get(campo)?.hasError('maxlength');
  }

  if (error === 'minLength'){
    return this.registerForm.get(campo)?.hasError('minlength');
  }

  if (error === 'max'){
    return this.registerForm.get(campo)?.hasError('max');
  }

  if (error === 'email'){
    return this.registerForm.get(campo)?.hasError('email');
  }
}

  ngOnInit(): any {
    this.getEventos();
  }

  openModal(template: any): void{
    this.registerForm.reset();
    template.show(template);
  }

  alternarImagem(): any {
    this.mostrarImagem = !this.mostrarImagem;
  }

  novoEvento(template: any): void{
    this.modoSalvar = 'post';
    this.openModal(template);
  }

  excluirEvento(evento: Evento, confirm: any): void{
    this.openModal(confirm);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: "${evento.tema}", código: "${evento.id}"?`;
  }

  confirmeDelete(template: any): void{
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
        template.hide();
        this.getEventos();
      }, error => {
        console.log(error);
      }
    );
  }

  editarEvento(evento: Evento, template: any): void{

    this.modoSalvar = 'put';
    this.openModal(template);
    this.evento = evento;
    this.registerForm.patchValue(this.evento);

    // Correção do formato da data (campo DatePicker)
    this.registerForm.get('dataEvento')?.setValue(new Date(this.evento.dataEvento));
/*     this.registerForm.get('tema')?.setValue(evento.tema);
    this.registerForm.get('local')?.setValue(evento.local);
    this.registerForm.get('dataEvento')?.setValue(evento.dataEvento + '.000Z');
    this.registerForm.get('qtdPessoas')?.setValue(evento.qtdPessoas);
    this.registerForm.get('imagemUrl')?.setValue(evento.imagemUrl);
    this.registerForm.get('telefone')?.setValue(evento.telefone);
    this.registerForm.get('email')?.setValue(evento.email); */
    console.log(evento);

  }

  salvarAlteracao(template: any): void{
    if (this.registerForm.valid){
      if (this.modoSalvar === 'post'){
        this.evento = Object.assign({}, this.registerForm.value);
        this.eventoService.postEvento(this.evento).subscribe(
          (novoEvento: any) => {
            console.log(novoEvento);
            template.hide();
            this.getEventos();
          }, error => {
            console.log(error);
          }
        );
      }else{
        this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);
        this.eventoService.putEvento(this.evento).subscribe(
          () => {
            template.hide();
            this.getEventos();
          }, error => {
            console.log(error);
          }
        );
      }

    }

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
