import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Genre } from 'src/app/genres/genre.model';
import { GenresService } from 'src/app/genres/genres.service';

import { Manga } from '../../../mangas/manga.model';
import { MangasService } from '../../../mangas/mangas.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-manga-edit',
  templateUrl: './manga-edit.component.html',
  styleUrls: ['./manga-edit.component.css'],
})
export class MangaEditComponent implements OnInit {
  imagePreview = '';
  manga!: Manga;
  form!: FormGroup;
  isLoading = false;

  genres: Genre[] = [];
  private genresSub: Subscription = new Subscription();

  private id!: number;
  private authStatusSub!: Subscription;

  constructor(
    public mangasService: MangasService,
    public genresService: GenresService,
    public route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      author: new FormControl(null, {
        validators: [Validators.required],
      }),
      description: new FormControl(null, {
        validators: [Validators.required],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
      genres: new FormArray([], {}),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.id = (paramMap.get('id') as unknown) as number;
        this.isLoading = true;
        this.mangasService.getManga(this.id).subscribe((data) => {
          this.isLoading = false;
          this.manga = data.manga;
          // set values
          this.form.setValue({
            title: this.manga.title,
            author: this.manga.author,
            description: this.manga.description,
            image: this.manga.image,
            genres: [],
          });
          const genres: FormArray = this.form.get('genres') as FormArray;
          this.manga.genres.forEach((genre) => {
            genres.push(new FormControl(genre));
          });
        });
      }
    });
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });

    this.genres = this.genresService.getGenres();
    this.genresService
      .getGenreUpdateListener()
      .subscribe((genresData: { genres: Genre[] }) => {
        this.genres = genresData.genres;
      });
  }

  onEditManga(): void {
    if (this.form.invalid) return;

    console.log(this.form.value.genres);
    this.isLoading = true;
    const manga: Manga = {
      id: this.id,
      title: this.form.value.title,
      description: this.form.value.description,
      author: this.form.value.author,
      image: this.form.value.image,
      genres: this.form.value.genres,
    };
    this.mangasService.updateManga(manga);
    this.form.reset();
  }

  onImagePicked(event: Event): void {
    // catch image
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const file = (event.target as HTMLInputElement).files![0];
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();

    // display img
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader?.result as string;
    };
    reader.readAsDataURL(file);
  }

  onCheckboxChange(event: MatCheckboxChange): void {
    const genres: FormArray = this.form.get('genres') as FormArray;

    if (event.checked) {
      genres.push(new FormControl(event.source.value));
    } else {
      let i = 0;
      genres.controls.forEach((item) => {
        if (item.value == event.source.value) {
          genres.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
    this.genresSub.unsubscribe();
  }
}
