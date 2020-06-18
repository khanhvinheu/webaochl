import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    CanActivate,
    Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class NhanvienGuard implements CanActivate {
    constructor(private router: Router, private loginService: LoginService) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | boolean {
        return this.loginService.auth().pipe(
            map(res => {
                if (res['user']) {
                    this.loginService.updateUser(res['user']);
                    if (res['user'].idQuyen === 2) {
                        return true;
                    }
                }
                this.router.navigateByUrl('/login');
                return false;
            })
        );
    }
}
