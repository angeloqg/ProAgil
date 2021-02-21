import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { error } from 'protractor';
import { User } from 'src/app/_models/User';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {

  user: User;
  registerForm: FormGroup;

  constructor( private formBuilder: FormBuilder
             , private toastr: ToastrService
             , private authService: AuthService
             , public router: Router) {

    this.user = new User();

    this.registerForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required],
      passwords: this.formBuilder.group({
        password: ['', [Validators.required, Validators.minLength(4)]],
        confirmPassword: ['', Validators.required],
      }, { validator: this.compararSenhas })
    });
  }

  compararSenhas(fb: FormGroup): void {

    const confimSenhaCtrl = fb.get('confirmPassword');

    if (confimSenhaCtrl?.errors === null || 'mismatch' && confimSenhaCtrl?.errors){
      if (fb.get('password')?.value !== confimSenhaCtrl?.value){
        confimSenhaCtrl.setErrors({ mismatch : true});
      }
      else{
        confimSenhaCtrl.setErrors(null);
      }
    }
  }


  ngOnInit(): any {}

  cadastrarUsuario(): void{

    if (this.registerForm.valid){

      this.user.FullName = this.registerForm.get('fullName')?.value;
      this.user.Email = this.registerForm.get('email')?.value;
      this.user.Username = this.registerForm.get('userName')?.value;
      this.user.Password = this.registerForm.get('passwords.password')?.value;

      this.authService.register(this.user).subscribe(
        () => {
          this.router.navigate(['/user/login']);
          this.toastr.success('Cadastro realizado!');
        },
        (erro: any) => {

          const err = erro.error;
          this.authService.register(this.user).subscribe(
            () => {
              this.router.navigate(['/user/login']);
              this.toastr.success('Cadastro realizado!');
            },
            (erro: any) => {

                for (const element of erro.error){
                  switch (element.code) {
                    case 'DuplicateUserName':
                      this.toastr.error('Cadastro Duplicado!');
                      break;

                    default:
                      this.toastr.error(`Erro no cadastro: ${element.code}`);
                      break;
                  }
                }
              });
        }
      );
    }
  }
}
