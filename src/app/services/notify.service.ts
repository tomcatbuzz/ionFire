import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable()
export class NotifyService {

  constructor(private toastController: ToastController) {}

  async presentToast(message, duration) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'Done'
    });
    toast.present();
  }

  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      message: 'Click to Close',
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'Done'
    });
    toast.present();
  }
}
