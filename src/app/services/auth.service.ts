import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs/';
import { switchMap, take, map } from 'rxjs/operators';
import { DbService } from './db.service';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { LoadingController } from '@ionic/angular';
import { NotifyService } from './notify.service';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private db: DbService,
    private router: Router,
    private storage: Storage,
    private platform: Platform,
    private gplus: GooglePlus,
    private loadingController: LoadingController,
    private notify: NotifyService
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => (user ? db.doc$(`users/${user.uid}`) : of(null)))
    );

    this.handleRedirect();
  }

  uid() {
    return this.user$
      .pipe(
        take(1),
        map(u => u && u.uid)
      )
      .toPromise();
  }

  async anonymousLogin() {
    const credential = await this.afAuth.auth.signInAnonymously();
    return await this.updateUserData(credential.user);
  }


  private updateUserData({ uid, email, displayName, photoURL, isAnonymous }) {
    const path = `users/${uid}`;

    const data = {
      uid,
      email,
      displayName,
      photoURL,
      isAnonymous
    };

    return this.db.updateAt(path, data);
  }

  // async googleLogin() {
  //   if (this.platform.is('cordova')) {
  //     await this.nativeGoogleLogin();
  //   } else {
  //     await this.webGoogleLogin();
  //   }
  // }

  //// Email/Password Auth ////
  // async normalLogin() {
  //   const credential = await this.afAuth.auth.signInWithEmailAndPassword();
  //   return await this.updateUserData(credential.user)
  // }

  async emailSignup(authData: AuthData) {
    const credential = await this.afAuth.auth.createUserWithEmailAndPassword(authData.email,
      authData.password);
      return await this.updateUserData(credential.user)
        .then(() => {
          this.notify.presentToast('Welcome new user!', 3000);
        })
        .catch(error => this.handleError(error));
  }

  async emailLogin(authData: AuthData) {
    const credential = await this.afAuth.auth.signInWithEmailAndPassword(authData.email,
      authData.password);
    return await this.updateUserData(credential.user)
      .then(() => {
        this.notify.presentToast('Welcome back!', 3000);
      })
      .catch(error => this.handleError(error));
  }

  // Sends email allowing user to reset password
  resetPassword(email: string) {
    const fbAuth = auth();

    return fbAuth
      .sendPasswordResetEmail(email)
      .then(() => this.notify.presentToast('Password update email sent', 3000))
      .catch(error => this.handleError(error));
  }

  // If error, console log and notify user
  private handleError(error: Error) {
    console.error(error);
    this.notify.presentToast(error.message, 3000);
  }
  // Google Auth

  setRedirect(val) {
    this.storage.set('authRedirect', val);
  }

  async isRedirect() {
    return await this.storage.get('authRedirect');
  }

  async googleLogin() {
    try {
      let user;

      if (this.platform.is('cordova')) {
        user = await this.nativeGoogleLogin();
      } else {
        await this.setRedirect(true);
        const provider = new auth.GoogleAuthProvider();
        user = await this.afAuth.auth.signInWithRedirect(provider);
      }

      return await this.updateUserData(user);
    } catch (err) {
      console.log(err);
    }
  }

  // Handle login with redirect for web Google auth
  private async handleRedirect() {
    if ((await this.isRedirect()) !== true) {
      return null;
    }
    const loading = await this.loadingController.create();
    await loading.present();

    const result = await this.afAuth.auth.getRedirectResult();

    if (result.user) {
      await this.updateUserData(result.user);
    }

    await loading.dismiss();

    await this.setRedirect(false);

    return result;
  }

  async webGoogleLogin(): Promise<any> {
    try {
      const provider = new auth.GoogleAuthProvider();
      const credential = await this.afAuth.auth.signInWithPopup(provider);
      if (credential.user) {
        await this.updateUserData(credential.user);
      }
      return credential;

    } catch (err) {
      console.log(err);
    }

  }

  async nativeGoogleLogin(): Promise<any> {
    const gplusUser = await this.gplus.login({
      webClientId: '708204141988-q6qck50okem05ug5k46f7bjqqarmscpo.apps.googleusercontent.com',
      offline: true,
      scopes: 'profile email'
    });

    return await this.afAuth.auth.signInWithCredential(
      auth.GoogleAuthProvider.credential(gplusUser.idToken)
    );
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    return this.router.navigate(['/']);
  }
}
