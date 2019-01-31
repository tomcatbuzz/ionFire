import { Component, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss']
})
export class TutorialPage {
  @ViewChild(IonSlides)
  slides: IonSlides;

  constructor(private storage: Storage, private router: Router) {}

  async finish() {
    await this.storage.set('tutorialComplete', true);
    this.router.navigateByUrl('/');
  }

  next() {
    this.slides.slideNext();
  }
}
