import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Manga } from '../manga.model';
import { MangasService } from '../mangas.service';

@Component({
  selector: 'app-manga-show',
  templateUrl: './manga-show.component.html',
  styleUrls: ['./manga-show.component.css'],
})
export class MangaShowComponent implements OnInit {
  isLoading = false;
  manga!: Manga;
  id!: number;
  stars: string[] = [];
  vote_msg = '';

  constructor(
    public mangasService: MangasService,
    public route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.isLoading = true;
      this.id = (paramMap.get('id') as unknown) as number;
      this.mangasService
        .getManga(this.id)
        .subscribe((mangaData: { manga: Manga; message: string }) => {
          this.manga = mangaData.manga;
          this.isLoading = false;

          this.generateStars();
        });
    });
  }

  generateStars(): void {
    const roundedScore = Math.round(this.manga.score);
    if (this.manga.votes > 1) this.vote_msg = 'votes';
    else this.vote_msg = 'vote';

    for (let score = 0; score < 10; score += 2) {
      const rest = roundedScore - score;
      if (rest >= 2) this.stars.push('star');
      else if (rest > 0 && rest <= 2) this.stars.push('star_half');
      else this.stars.push('star_outline');
    }
  }
}
