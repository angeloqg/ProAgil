import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_services/auth.service';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(private toastr: ToastrService,
              public authService: AuthService,
              public router: Router) {

               }

  ngOnInit(): any {
  }

  usuario(): any{
    return localStorage.getItem('usuario');
  }

  entrar(): void{
    this.router.navigate(['/user/login']);
  }

  loggedIn(): boolean{
    return !this.authService.loggedIn();
  }

  logout(): void{
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.toastr.show('Log OUT');
    this.router.navigate(['/user/login']);
  }
}
