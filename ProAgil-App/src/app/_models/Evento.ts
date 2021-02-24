import { Lote } from './Lote';
import { Palestrante } from './Palestrante';
import { RedeSocial } from './RedeSocial';

export class Evento {

    private Id: number;
    private Local: string;
    private DataEvento: Date;
    private Tema: string;
    private QtdPessoas: number;
    private ImagemUrl: string;
    private Telefone: string;
    private Email: string;
    private Lotes: Lote[];
    private RedesSociais: RedeSocial[];
    private PalestrantesEventos: Palestrante[];

    constructor() {
      this.Id = 0;
      this.Local = '';
      this.DataEvento = new Date(Date.now());
      this.Tema = '';
      this.QtdPessoas = 0;
      this.ImagemUrl = '';
      this.Telefone = '';
      this.Email = '';
      this.Lotes = [];
      this.RedesSociais = [];
      this.PalestrantesEventos = [];
    }
  
    public get local(): string {
      return this.Local;
    }
  
    public set local(value: string) {
      this.Local = value;
    }
  
    public get tema(): string {
      return this.Tema;
    }
  
    public set tema(value: string) {
      this.Tema = value;
    }
  
    public get imagemUrl(): string {
      return this.ImagemUrl;
    }
  
    public set imagemUrl(value: string) {
      this.ImagemUrl = value;
    }
  
    public get telefone(): string {
      return this.Telefone;
    }
  
    public set telefone(value: string) {
      this.Telefone = value;
    }
  
    public get email(): string {
      return this.Email;
    }
  
    public set email(value: string) {
      this.Email = value;
    }
  
    public get dataEvento(): Date {
      return this.DataEvento;
    }
    public set dataEvento(value: Date) {
      this.DataEvento = value;
    }
  
    public get id(): number {
      return this.Id;
    }
    public set id(value: number) {
      this.Id = value;
    }
  
    public get qtdPessoas(): number {
      return this.QtdPessoas;
    }
    public set qtdPessoas(value: number) {
      this.QtdPessoas = value;
    }
    public get lotes(): Lote[] {
      return this.Lotes;
    }
    public set lotes(value: Lote[]) {
      this.Lotes = value;
    }
    public get redesSociais(): RedeSocial[] {
      return this.RedesSociais;
    }
    public set redesSociais(value: RedeSocial[]) {
      this.RedesSociais = value;
    }

    public get palestrantesEventos(): Palestrante[] {
      return this.PalestrantesEventos;
    }
    public set palestrantesEventos(value: Palestrante[]) {
      this.PalestrantesEventos = value;
    }
}

