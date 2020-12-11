import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Manga } from '../manga.model'
import { MangasService } from '../mangas.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-manga-edit',
  templateUrl: './manga-edit.component.html',
  styleUrls: ['./manga-edit.component.css']
})
export class MangaEditComponent implements OnInit {

  imagePreview: string = '';
  manga!: Manga;
  form!: FormGroup;
  isLoading = false;

  private id!: string;

  constructor(public mangasService: MangasService, public route: ActivatedRoute) { }

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
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('id')){
        this.id = paramMap.get('id') as string;
        this.isLoading = true;
        this.mangasService.getManga(this.id).subscribe(manga => {
          this.isLoading = false;
          this.manga = {
            id: manga._id,
            title: manga.title,
            description: manga.description,
            author: manga.author,
            image: manga.image,
          }
          // set values
          this.form.setValue({
            title: this.manga.title,
            author: this.manga.author,
            description: this.manga.description,
            image: this.manga.image,
          });
        });
      }
    })
  }

  onEditManga(): void {
    if(this.form.invalid) return;

    this.isLoading = true;
    const manga: Manga = { 
      id: this.id,
      title: this.form.value.title,           
      description: this.form.value.description,
      author: this.form.value.author,
      image: this.form.value.image
    }
    this.mangasService.updateManga(manga);
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
}
