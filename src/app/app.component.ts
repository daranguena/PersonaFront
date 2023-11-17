import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstadosService } from './services/estados/estados.service';
import { PaisesService } from './services/paises/paises.service';
import { PersonaService } from './services/persona/persona.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  title = 'personafront';
  personaForm: FormGroup | any;
  paises: any;
  estados: any;
  personas: any;
  page!: number;
  idPaisSeleccionado: string = "";
  idEstadoSeleccionado: string = "";

  constructor(
    public fb: FormBuilder,
    public personaService: PersonaService,
    public estadosService: EstadosService,
    public paisesService: PaisesService 
  ) {
  }

  ngOnInit(): void {
    this.personaForm = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', Validators.required],
      pais: ['', Validators.required],
      estado: ['', Validators.required]
    })
    this.paisesService.getAllPaises().subscribe(
      resp => { this.paises = resp },
      error => { console.error(error) }
    )

    this.personaService.getAllPersonas().subscribe(
      paises => { this.personas = paises },
      error => { console.error(error) }
    )

    this.personaForm.get("pais").valueChanges.subscribe((value: { id: any; }) =>
      this.estadosService.getAllEstadosByPaisId(value.id).subscribe(
        estados => { this.estados = estados},
        error => { console.error(error) }
      )
    )
  }

  guardar(): void {
    this.personaService.savePersona(this.personaForm.value).subscribe(
      resp => {
        this.personaForm.reset();
        this.personas = this.personas.filter((persona: { id: any; })=>resp.id!=persona.id);
        this.personas.push(resp);
      },
      error => { console.error(error) })
  }

  eliminar(persona: any) {
    this.personaService.deletePersona(persona.id).subscribe(
      resp => {
        if (resp == true) {
          this.personas.pop(persona)
        }
      },
      error => { console.error(error) })
  }

  editarPersona(persona: any) {
    this.personaForm.setValue({
      id: persona.id,
      nombre: persona.nombre,
      apellido: persona.apellido,
      edad: persona.edad,
      pais: persona.pais,
      estado: persona.estado 
    });
    this.idPaisSeleccionado = persona.pais.id;
    this.idEstadoSeleccionado = persona.estado.id;
  }
}
