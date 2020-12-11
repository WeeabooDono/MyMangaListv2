import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangaEditComponent } from './manga-edit.component';

describe('MangaEditComponent', () => {
  let component: MangaEditComponent;
  let fixture: ComponentFixture<MangaEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MangaEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MangaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
