import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/EventoService';
import { ToastrService } from 'ngx-toastr';
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { environment } from 'src/environments/environment';
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
})
export class EventosComponent implements OnInit {
  titulo = 'Eventos';
  urlImage = environment.apiUrl;
  eventosFiltrados: Evento[];
  eventos: Evento[];
  private evento: Evento;

  fileNameToUpdate: string;
  dataAtual: string;

  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  registerForm: FormGroup;
  modoSalvar: string;
  bodyDeletarEvento = '';

  file: File | undefined;

  private filtro = '';

  public get filtroLista(): string {
    return this.filtro;
  }
  public set filtroLista(value: string) {
    this.filtro = value;
  }

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private localService: BsLocaleService,
    private toastr: ToastrService
  ) {
    this.eventosFiltrados = [];
    this.eventos = [];
    this.fileNameToUpdate = '';
    this.evento = new Evento();
    this.modoSalvar = '';
    this.localService.use('pt-br');
    this.dataAtual = new Date().getMilliseconds().toString();
    this.registerForm = formBuilder.group({
      tema: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      imagemUrl: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  validation(campo: string, error: string = 'errors'): any {
    if (error === 'errors') {
      return this.registerForm.get(campo)?.errors;
    }

    if (error === 'touched') {
      return this.registerForm.get(campo)?.touched;
    }

    if (error === 'invalid') {
      return this.registerForm.get(campo)?.invalid;
    }

    if (error === 'dirty') {
      return this.registerForm.get(campo)?.dirty;
    }

    if (error === 'required') {
      return this.registerForm.get(campo)?.hasError('required');
    }

    if (error === 'maxLength') {
      return this.registerForm.get(campo)?.hasError('maxlength');
    }

    if (error === 'minLength') {
      return this.registerForm.get(campo)?.hasError('minlength');
    }

    if (error === 'max') {
      return this.registerForm.get(campo)?.hasError('max');
    }

    if (error === 'email') {
      return this.registerForm.get(campo)?.hasError('email');
    }
  }

  ngOnInit(): any {
    this.getEventos();
  }

  openModal(template: any): void {
    this.registerForm.reset();
    template.show(template);
  }

  alternarImagem(): any {
    this.mostrarImagem = !this.mostrarImagem;
  }

  novoEvento(template: any): void {
    this.modoSalvar = 'post';
    this.openModal(template);
  }

  excluirEvento(evento: Evento, confirm: any): void {
    this.openModal(confirm);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: "${evento.tema}", código: "${evento.id}"?`;
  }

  confirmeDelete(template: any): void {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
        template.hide();
        this.getEventos();
        this.toastr.success('Deletado com sucesso!');
      },
      (error) => {
        console.log(error);
        this.toastr.error(`Erro ao deletar: ${error}`);
      }
    );
  }

  editarEvento(evento: Evento, template: any): void {
    this.modoSalvar = 'put';
    this.openModal(template);
    this.evento = Object.assign({}, evento);

    this.fileNameToUpdate = evento.imagemUrl.toString();

    this.evento.imagemUrl = '';
    this.registerForm.patchValue(this.evento);

    // Correção do formato da data (campo DatePicker)
    this.registerForm
      .get('dataEvento')
      ?.setValue(new Date(this.evento.dataEvento));
  }

  uploadImage(): void {
    if (this.modoSalvar === 'post'){
      // Obtendo o nome do arquivo (tratativa para extrair o nome do arquivo do campo file, pois o nome acompanha uma 'Fake' url)
      const nomeArquivo = this.evento.imagemUrl.split('\\', 3);

      this.evento.imagemUrl = nomeArquivo[2];

      // Antes de gravar os dados no banco, salva primeiro o arquivo
      this.eventoService.postUpload(this.file, nomeArquivo[2]).subscribe(
        () => {
          this.dataAtual = new Date().getMilliseconds().toString();
          this.getEventos();
        }
      );
    }else{
      this.evento.imagemUrl = this.fileNameToUpdate;

      // Antes de gravar os dados no banco, salva primeiro o arquivo
      this.eventoService.postUpload(this.file, this.evento.imagemUrl).subscribe(
        () => {
          this.dataAtual = new Date().getMilliseconds().toString();
          this.getEventos();
        }
      );
    }
  }

  salvarAlteracao(template: any): void {
    if (this.registerForm.valid) {
      if (this.modoSalvar === 'post') {
        this.evento = Object.assign({}, this.registerForm.value);

        this.uploadImage();

        // Correção no formato de data ao inserir registro
        const auxEvento = this.evento;
        const dtAux = new Date(this.evento.dataEvento).toLocaleString('us-En');
        auxEvento.dataEvento = new Date(dtAux);

        this.eventoService.postEvento(auxEvento).subscribe(
          (novoEvento: any) => {
            template.hide();
            this.getEventos();
            this.toastr.success('Inserido com sucesso!');
          },
          (error) => {
            this.toastr.error(`Erro ao inserir: ${error}`);
          }
        );
      } else {
        this.registerForm
          .get('dataEvento')
          ?.setValue(new Date(this.evento.dataEvento).toLocaleString('pt-Br'));
        this.evento = Object.assign(
          { id: this.evento.id },
          this.registerForm.value
        );

        this.uploadImage();

        this.eventoService.putEvento(this.evento).subscribe(
          () => {
            template.hide();
            this.getEventos();
            this.toastr.success('Atualizado com sucesso!');
          },
          (error) => {
            console.log(error);
            this.toastr.error(`Erro ao editar: ${error}`);
          }
        );
        this.registerForm
          .get('dataEvento')
          ?.setValue(new Date(this.evento.dataEvento).toLocaleString('pt-Br'));
      }
    }
  }

  getEventos(): void {
    this.eventoService.getAllEventos().subscribe(
      (evt: Evento[]) => {
        this.eventos = evt;
        this.eventosFiltrados = this.eventos;
      },
      (error) => {
        this.toastr.error(`Falha ao tentar carregar eventos: ${error}`);
      }
    );
  }

  filtrarEvento(): Evento[] {
    if (this.filtroLista === '') {
      this.eventosFiltrados = this.eventos;
    }

    this.filtroLista = this.filtroLista.toLocaleLowerCase();
    const evt = JSON.parse(JSON.stringify(this.eventos));

    this.eventosFiltrados = [];
    for (const valor of this.eventos) {
      if (valor.tema.toLocaleLowerCase().includes(this.filtroLista)) {
        this.eventosFiltrados.push(valor);
      }
    }

    return this.eventosFiltrados;
  }

  limparBusca(): Evento[] {
    this.filtroLista = '';
    this.eventosFiltrados = this.eventos;
    return this.eventosFiltrados;
  }

  onFileChange(event: any): void {

    const reader = new FileReader();

    // Validando se o arquivo existe / tem tamanho maior que zero
    if (event.target.files && event.target.files.length) {
      this.file = event.target.files;
    }
  }
}
