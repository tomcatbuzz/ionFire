import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { FcmService } from './services/fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  // @ViewChild(MenuController)
  // menu: Menu;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menu: MenuController,
    private storage: Storage,
    private router: Router,
    private fcm: FcmService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.fcm.getPermission().subscribe();
      this.fcm.listenToMessages().subscribe();
    });
  }

  async resetTutorial() {
    await this.storage.set('tutorialComplete', false);
    await this.router.navigateByUrl('/tutorial');
    this.menu.close();
  }

  closeMenu() {
    this.menu.close();
  }
}
