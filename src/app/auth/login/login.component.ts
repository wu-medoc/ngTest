import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { SocialAuthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  AmazonLoginProvider,
} from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  message: string;
  user: SocialUser;
  isLoggedIn: boolean;

  constructor(public authService: AuthService, public router: Router, private socialAuthService: SocialAuthService) {
    this.setMessage();
  }

  // tslint:disable-next-line: typedef
  ngOnInit() {
    this.socialAuthService.authState.subscribe(user => {
      this.user = user;
    });
    this.authService.login().subscribe(() => {
      this.setMessage();
    });
  }

  // tslint:disable-next-line: typedef
  setMessage() {
    this.message = 'Logged ' + (this.authService.isLoggedIn ? 'in' : 'out');
  }

  signInWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  // tslint:disable-next-line: typedef
  login() {
    this.message = 'Trying to log in ...';

    this.authService.login().subscribe(() => {
      this.setMessage();
      if (this.authService.isLoggedIn) {
        // Usually you would use the redirect URL from the auth service.
        // However to keep the example simple, we will always redirect to `/admin`.
        const redirectUrl = '/admin';

        // Set our navigation extras object
        // that passes on our global query params and fragment
        const navigationExtras: NavigationExtras = {
          queryParamsHandling: 'preserve',
          preserveFragment: true
        };

        // Redirect the user
        this.router.navigate([redirectUrl], navigationExtras);
      }
    });
  }

  // tslint:disable-next-line: typedef
  logout() {
    this.authService.logout();
    this.socialAuthService.signOut();
    this.setMessage();
  }
}
