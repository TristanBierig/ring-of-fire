import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';

@Component({
  selector: 'app-dialog-edit-player',
  templateUrl: './dialog-edit-player.component.html',
  styleUrls: ['./dialog-edit-player.component.scss']
})
export class DialogEditPlayerComponent {
  playerName: string = this.data.playerName;
  selectedAvatar: string = '';

  outputData = {
    name: this.playerName,
    avatar: this.selectedAvatar
  };
  
  

  avatars: string[] = [
    'assets/img/profile/1.webp',
    'assets/img/profile/2.png',
    'assets/img/profile/monkey.png',
    'assets/img/profile/pinguin.svg',
    'assets/img/profile/serious-woman.svg',
    'assets/img/profile/winkboy.svg'
  ];


  constructor(@Inject(MAT_DIALOG_DATA) public data: { playerName: any }, public dialogRef: MatDialogRef<DialogAddPlayerComponent>) { }


  onNoClick() {
    this.dialogRef.close();
  }


  selectAvatar(i: number) {
    this.outputData.avatar = this.avatars[i];
  }


}
