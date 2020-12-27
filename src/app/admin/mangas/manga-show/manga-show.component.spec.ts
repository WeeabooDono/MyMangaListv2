import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangaShowComponent } from './manga-show.component';

describe('MangaShowComponent', () => {
  let component: MangaShowComponent;
  let fixture: ComponentFixture<MangaShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MangaShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MangaShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
