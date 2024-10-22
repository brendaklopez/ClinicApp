import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

import { HorariosService } from '../../services/horarios.service';
import { CategoriasService } from '../../services/categorias.service';
import { RegistroService } from '../../services/registro.service';
import { SweetAlertService } from '../../services/alerts/sweet-alert.service';

import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { Categoria, Horario } from '../../interfaces/api';
import { MedicoRegister, UsuarioRegister } from '../../interfaces/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [NavbarComponent, RouterLink, FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent implements OnInit {
  vistaHeader = true;
  section: string = '';
  especialidades: Categoria[] = [];
  horarios: Horario[] = [];
  password: string = '';
  isPasswordVisible: boolean = false;

  user: UsuarioRegister = {
    dni: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
  };

  medico: MedicoRegister = {
    dni: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    idCategoria: 0,
    idHorario: 0,
  };

  private categoriaService = inject(CategoriasService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private registroService = inject(RegistroService);
  private horarioService = inject(HorariosService);
  sweetAlertService = inject(SweetAlertService);

  constructor() {}

  ngOnInit(): void {
    this.section = this.route.snapshot.routeConfig?.path || '';
    console.log(this.section);
    this.getEspecialidades();
    this.getHorarios();
  }

  //servicio de especialidades JS
  getEspecialidades() {
    this.categoriaService.getEspecialidades().subscribe((data: any) => {
      this.especialidades = data.data;
      // console.log(this.especialidades);
    });
  }

  //servicio de horarios DB
  getHorarios() {
    this.horarioService.getHorarios().subscribe((data: any) => {
      this.horarios = data.data;
      // console.log(this.horarios);
    });
  }

  enviarRegistroUsuario(form: NgForm) {
    if (form.valid) {
      const usuario = {
        nombre: form.value.nombre,
        apellido: form.value.apellido,
        email: form.value.email,
        telefono: form.value.telefono,
        dni: form.value.dni,
        password: form.value.password,
      };
      console.log(usuario);
      this.registroService
        .registrarUsuario(usuario)
        .subscribe((data: UsuarioRegister) => {
          this.sweetAlertService.success(`Usuario creado con éxito.`);
          console.log(data);
        });
      localStorage.setItem('usuario', JSON.stringify(usuario));
      this.router.navigate(['/login']);
      form.reset();
    } else {
      this.sweetAlertService.alert('Por favor, completa todos los campos.');
    }
  }

  enviarRegistroMedico(form: NgForm) {
    if (form.valid) {
      const medico = {
        nombre: form.value.nombre,
        apellido: form.value.apellido,
        email: form.value.email,
        telefono: form.value.telefono,
        dni: form.value.dni,
        password: form.value.password,
        idCategoria: form.value.idCategoria,
        idHorario: form.value.idHorario,
      };
      this.registroService
        .registrarMedico(medico)
        .subscribe((data: MedicoRegister) => {
          this.sweetAlertService.success(`Medico creado con éxito.`);
          console.log(data);
        });
      localStorage.setItem('medico', JSON.stringify(medico));
      this.router.navigate(['/login']);
      form.reset();
    } else {
      this.sweetAlertService.alert('Por favor, completa todos los campos.');
    }
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
