import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { SharedIonicModule } from '../../shared/shared-ionic.module';
import { HttpClientModule } from '@angular/common/http'; // <-- pour l'import

@Component({
  selector: 'app-register',
  standalone: true,
    imports: [
      SharedIonicModule,
      FormsModule,
      HttpClientModule, // <-- important !
      ReactiveFormsModule
    ],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      telephone: ['']
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.http.post('http://localhost:3000/api/register', this.registerForm.value).subscribe({
        next: () => {
          alert('Compte créé avec succès');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de la création du compte');
        }
      });
    }
  }
}
