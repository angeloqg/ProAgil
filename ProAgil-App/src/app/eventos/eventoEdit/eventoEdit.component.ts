import { Component, isDevMode, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/_models/Evento';
import { EventoService } from 'src/app/_services/EventoService';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { environmentProd } from 'src/environments/environment.prod';
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-evento-edit',
  templateUrl: './eventoEdit.component.html',
  styleUrls: ['./eventoEdit.component.scss'],
})
export class EventoEditComponent implements OnInit {

  titulo = 'Editar Evento';

  baseURL = isDevMode() ? environment.apiUrl : environmentProd.apiUrl;

  evento: Evento;

  imagemURL = 'assets/img/upload.png';
  file: File | undefined;

  fileNameToUpdate = '';
  dataAtual = new Date().getMilliseconds().toString();
  registerForm: FormGroup;

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private localService: BsLocaleService,
    private toastr: ToastrService,
    private router: ActivatedRoute
  ) {

    this.registerForm = formBuilder.group({
      id: [],
      tema: ['', [ Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      lotes: this.formBuilder.array([]),
      redesSociais: this.formBuilder.array([]),
      imagemURL: ['']
    });

    this.evento = new Evento();

    this.localService.use('pt-br');

    this.carregarEvento();
  }

  carregarEvento(): void{
    const idEvento: string | null = this.router.snapshot.paramMap.get('id');


    this.eventoService.getEventoById(+`${idEvento}`).subscribe(
      (evt: Evento) => {
        this.evento = Object.assign({}, evt);
        this.fileNameToUpdate = this.evento.imagemUrl.toString();

        this.evento.imagemUrl = `${this.baseURL}resources/images/${ this.evento.imagemUrl }?_ts=${this.dataAtual}`;
        this.imagemURL = this.evento.imagemUrl;
        this.registerForm.patchValue(this.evento);

        this.evento.lotes.forEach(lote => {
          this.lotes.push(this.criaLote(lote));
        });

        this.evento.redesSociais.forEach(redeSocial => {
          this.redesSociais.push(this.criaRedeSocial(redeSocial));
        });
      },
      (error) => {
        this.toastr.error(`Falha ao tentar carregar eventos: ${error}`);
      }
    );
  }

  criaLote(lote: any): FormGroup{
    return this.formBuilder.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim],
    });
  }

  criaRedeSocial(redeSocial: any): FormGroup{
    return this.formBuilder.group({
      id: [redeSocial.id],
      nome: [redeSocial.nome, Validators.required],
      url: [redeSocial.url, Validators.required],
    });
  }

  get lotes(): FormArray{
    return this.registerForm.get('lotes') as FormArray;
  }

  get redesSociais(): FormArray{
    return this.registerForm.get('redesSociais') as FormArray;
  }

  adicionarLote(): void{
    this.lotes.push(this.criaLote({ id: 0 }));
  }

  adicionarRedeSocial(): void{
    this.redesSociais.push(this.criaRedeSocial({ id: 0 }));
  }

  removerLote(id: number): void{
    this.lotes.removeAt(id);
  }

  removerRedeSocial(id: number): void{
    this.redesSociais.removeAt(id);
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

  ngOnInit(): any {}

  onFileChange(evt: any): void{

    const reader = new FileReader();

    if (evt.target.files && evt.target.files.length) {

      const fl = evt.target.files;
      this.file = fl;
      reader.onload = (event: any) => this.imagemURL = event.target.result;
      reader.readAsDataURL(fl[0]);
    }
  }

  SalvarEvento(): void{

    this.evento = Object.assign({ id: this.evento.id }, this.registerForm.value);
    this.evento.imagemUrl = this.fileNameToUpdate;

    this.uploadImage();

    this.eventoService.putEvento(this.evento).subscribe(
      () => {
        this.toastr.success('Atualizado com sucesso!');
      },
      (error) => {
         this.toastr.error(`Erro ao editar: ${error}`);
      }
    );
  }

  uploadImage(): void{

    if (this.registerForm.get('imagemURL')?.value !== ''){

      this.eventoService.postUpload(this.file, this.evento.imagemUrl).subscribe(
        () => {
          this.dataAtual = new Date().getMilliseconds().toString();
          this.evento.imagemUrl = `${this.baseURL}resources/images/${ this.evento.imagemUrl }?_ts=${this.dataAtual}`;
        }
      );
    }
  }
}
