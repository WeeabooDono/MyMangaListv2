import { Component, OnDestroy, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

import { Manga } from '../manga.model'
import { MangasService } from '../mangas.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-manga-create',
  templateUrl: './manga-create.component.html',
  styleUrls: ['./manga-create.component.css']
})
export class MangaCreateComponent implements OnInit, OnDestroy {

  isLoading = false;

  form!: FormGroup;
  imagePreview: string = '';

  private authStatusSub!: Subscription;

  constructor(public mangasService: MangasService, private authService: AuthService) { }

  ngOnInit(): void { 
    this.form = new FormGroup({
      title: new FormControl(null, { 
        validators: [Validators.required, Validators.minLength(3)]
      }),
      author: new FormControl(null, {
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required], asyncValidators: [mimeType]
      })
    })
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onAddManga(): void {
    if(this.form.invalid) return;

    this.isLoading = true;
    const manga: Manga = { 
      id: 'null',
      title: this.form.value.title,           
      description: this.form.value.description,
      author: this.form.value.author,
      image: this.form.value.image,
    } 

    this.mangasService.addManga(manga);
    this.form.reset();
  }

  onImagePicked(event: Event){
    // catch image
    const file = (event.target as HTMLInputElement).files![0];
    this.form.patchValue({ image: file});
    this.form.get('image')?.updateValueAndValidity();
    
    // display img
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader!.result as string;
    }
    reader.readAsDataURL(file);
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
