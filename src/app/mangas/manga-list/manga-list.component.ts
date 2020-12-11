import { Component, OnDestroy, OnInit} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { Manga } from '../manga.model'
import { MangasService } from '../mangas.service';

@Component({
  selector: 'app-manga-list',
  templateUrl: './manga-list.component.html',
  styleUrls: ['./manga-list.component.css']
})
export class MangaListComponent implements OnInit, OnDestroy {

  mangas: Manga[] = [];
  private mangasSub: Subscription = new Subscription;

  isLoading = false;

  // pagination attributes
  length = 0;
  pageSize = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;

  constructor(public mangasService: MangasService) { }

  ngOnDestroy(): void {
    this.mangasSub.unsubscribe();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.mangas = this.mangasService.getMangas(this.currentPage, this.pageSize);
    this.mangasSub = this.mangasService.getMangasUpdateListener()
      .subscribe((mangaData: { mangas: Manga[], mangaCount: number }) => {
        this.isLoading = false;
        this.mangas = mangaData.mangas;
        this.length = mangaData.mangaCount;
      });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.pageSize = pageData.pageSize;
    this.mangas = this.mangasService.getMangas(this.currentPage, this.pageSize);
  }

  onDelete(id: string): void {
    this.isLoading = true;
    this.mangasService.deleteManga(id).subscribe(() => {
      // to update data since we update datas when we get mangas
      this.mangasService.getMangas(this.currentPage, this.pageSize);
    });
  }
}
