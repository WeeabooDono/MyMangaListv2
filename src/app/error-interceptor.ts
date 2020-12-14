import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorComponent } from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private dialog: MatDialog) {}

    intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(httpRequest).pipe(
            catchError((httpErrorResponse: HttpErrorResponse) => {
                let errorMessage = 'Oops, something went wrong !';
                if(httpErrorResponse.error.message){
                    errorMessage = httpErrorResponse.error.message;
                }
                this.dialog.open(ErrorComponent, { data: { message: errorMessage } });
                return throwError(httpErrorResponse);
            })
        );
    }
}