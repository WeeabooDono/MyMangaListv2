import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ConfirmationDialog } from '../../mangas/confirmation-dialog.component';
import { Team } from '../team.model';
import { TeamsService } from '../teams.service';

@Component({
    selector: 'app-team-list',
    templateUrl: './team-list.component.html',
    styleUrls: ['./team-list.component.css'],
})
export class TeamListComponent implements OnInit, OnDestroy {
    public isLoading = false;

    public displayedColumns = ['index', 'image', 'name', 'website', 'actions'];

    public teams: Team[] = [];
    private teamsSub: Subscription = new Subscription();

    constructor(
        private teamsService: TeamsService,
        private dialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.isLoading = true;
        this.teams = this.teamsService.getTeams();

        this.teamsSub = this.teamsService
            .getTeamsUpdateListener()
            .subscribe((teamData: { teams: Team[] }) => {
                this.teams = teamData.teams;
                this.isLoading = false;
            });
    }

    onDelete(id: number): void {
        const dialogRef = this.dialog.open(ConfirmationDialog, {
            data: {
                message: 'Are you sure you want to delete this team ?',
                buttonText: {
                    ok: 'Delete',
                    cancel: 'No',
                },
            },
        });

        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
                this.isLoading = true;
                this.teamsService.deleteTeam(id).subscribe(
                    () => {
                        // to update data since we update datas when we get mangas
                        this.teamsService.getTeams();
                    },
                    () => {
                        this.isLoading = false;
                    },
                );
            }
        });
    }

    ngOnDestroy(): void {
        this.teamsSub.unsubscribe();
    }
}
