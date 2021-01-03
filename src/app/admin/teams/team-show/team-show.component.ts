import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Member } from '../member.model';
import { Team } from '../team.model';
import { TeamsService } from '../teams.service';

@Component({
    selector: 'app-team-show',
    templateUrl: './team-show.component.html',
    styleUrls: ['./team-show.component.css'],
})
export class TeamShowComponent implements OnInit {
    public team!: Team;
    public members: Member[] = [];

    constructor(
        private teamsService: TeamsService,
        private router: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.router.paramMap.subscribe((paramMap: ParamMap) => {
            const id = (paramMap.get('id') as unknown) as number;
            this.teamsService
                .getTeam(id)
                .subscribe((teamData: { message: string; team: Team }) => {
                    this.team = teamData.team;
                    this.teamsService
                        .getTeamMembers(this.team.id)
                        .subscribe(
                            (membersData: {
                                members: Member[];
                                message: string;
                            }) => {
                                this.members = membersData.members;
                                console.log(this.members);
                            },
                        );
                });
        });
    }
}
