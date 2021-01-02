import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Team } from './team.model';

const BACKEND_URL = `${environment.apiUrl}/teams`;

@Injectable({ providedIn: 'root' })
export class TeamsService {
    private teams: Team[] = [];
    private teamsUpdated = new Subject<{ teams: Team[] }>();

    constructor(private http: HttpClient, private router: Router) {}

    getTeamsUpdateListener(): Observable<{ teams: Team[] }> {
        return this.teamsUpdated.asObservable();
    }

    getTeams(): Team[] {
        this.http
            .get<{ message: string; teams: Team[] }>(`${BACKEND_URL}`)
            .subscribe((data) => {
                this.teams = data.teams;
                this.teamsUpdated.next({
                    teams: [...this.teams],
                });
            });
        return [...this.teams];
    }

    deleteTeam(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${BACKEND_URL}/${id}`);
    }

    addTeam(team: Team): void {
        const teamData = new FormData();
        teamData.append('name', team.name);
        teamData.append('website', team.website);
        teamData.append('image', team.image, team.name);

        this.http
            .post<{ message: string; team: Team }>(`${BACKEND_URL}/`, teamData)
            .subscribe((response) => {
                this.router.navigate(['/admin/teams']);
            });
    }
}
