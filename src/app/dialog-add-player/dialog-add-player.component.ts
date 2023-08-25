import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add-player',
  templateUrl: './dialog-add-player.component.html',
  styleUrls: ['./dialog-add-player.component.scss']
})
export class DialogAddPlayerComponent {
  selectedAvatar: string = 'assets/img/profile/1.webp';
  focusAvatarIndex!: number;
  

  outputData = {
    name: '',
    avatar: ''
  };

  avatars: string[] = [
    'assets/img/profile/1.webp',
    'assets/img/profile/2.png',
    'assets/img/profile/monkey.png',
    'assets/img/profile/pinguin.svg',
    'assets/img/profile/serious-woman.svg',
    'assets/img/profile/winkboy.svg'
  ];

  constructor(public dialogRef: MatDialogRef<DialogAddPlayerComponent>) { }


  onNoClick() {
    this.dialogRef.close();
  }


  selectAvatar(i: number) {
    this.outputData.avatar = this.avatars[i];
    this.focusAvatarIndex = i;
  }

}
