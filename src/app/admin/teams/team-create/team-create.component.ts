import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { mimeType } from '../../mangas/manga-edit/mime-type.validator';
import { Team } from '../team.model';
import { TeamsService } from '../teams.service';

@Component({
    selector: 'app-team-create',
    templateUrl: './team-create.component.html',
    styleUrls: ['./team-create.component.css'],
})
export class TeamCreateComponent implements OnInit, OnDestroy {
    isLoading = false;

    form!: FormGroup;
    imagePreview = '';

    private authStatusSub!: Subscription;

    constructor(
        public teamsService: TeamsService,
        private authService: AuthService,
    ) {}

    ngOnInit(): void {
        this.form = new FormGroup({
            name: new FormControl(null, {
                validators: [Validators.required, Validators.minLength(3)],
            }),
            website: new FormControl(null, {
                validators: [Validators.required],
            }),
            image: new FormControl(null, {
                validators: [Validators.required],
                asyncValidators: [mimeType],
            }),
        });
        this.authStatusSub = this.authService
            .getAuthStatusListener()
            .subscribe((authStatus) => {
                this.isLoading = false;
            });
    }

    onAddTeam(): void {
        if (this.form.invalid) return;

        this.isLoading = true;
        const team: Team = {
            id: 0,
            name: this.form.value.name,
            website: this.form.value.website,
            image: this.form.value.image,
        };

        this.teamsService.addTeam(team);
        this.form.reset();
        this.isLoading = false;
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

    ngOnDestroy(): void {
        this.authStatusSub.unsubscribe();
    }
}
