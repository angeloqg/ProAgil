import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Login } from 'src/app/_models/Login';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  titulo = 'Login';

  model: Login;
  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    public router: Router
  ) {

    this.model = new Login();
  }

  ngOnInit(): void {
    if (localStorage.getItem('token') !== null){
      this.router.navigate(['/dashboard']);
    }
  }

  login(): void {

    this.authService.login(this.model).subscribe(

      () => {
        this.router.navigate(['/dashboard']);
        this.toastr.success('Logado com sucesso!');
        localStorage.setItem('usuario', this.authService.decodedToken?.unique_name);
      },
      (erro) =>{
        this.toastr.error('Falha ao logar!');
      }

    );

  }
}
