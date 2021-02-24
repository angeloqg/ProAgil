import { Component, OnInit } from '@angular/core';

import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent{

  constructor(){

  }

  showMenu(): boolean{
    return window.location.href.toString().toLocaleLowerCase().includes('login') ? false : true;
  }

}
