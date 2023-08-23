import { Component, OnInit, Input, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Game } from 'src/models/game';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, doc, getDoc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { __values } from 'tslib';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game!: Game;
  itemCollection: any;

  public currentGameId!: string;
  public currentGame!: any;
  private firestore: Firestore = inject(Firestore);

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
   
  }


  ngOnInit(): void {
    this.loadGame();
  }


  async loadGame() {
    this.currentGameId = this.route.snapshot.url[1].path;
    const docRef = doc(this.firestore, "games", this.currentGameId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this.currentGame = docSnap.data();
      this.game = this.currentGame;
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }

    this.currentGame = onSnapshot(doc(this.firestore, "games", this.currentGameId), (doc) => {
      console.log("Current data: ", doc.data());
      this.currentGame = doc.data();
      this.game = this.currentGame;
    });
  }


  async updateGame() {
    const docRef = doc(this.firestore, 'games', this.currentGameId);
    const updateData = this.currentGame;
    await updateDoc(docRef, updateData)
      .then(() => {
        console.log('Updated Game Data send succesfully');
      }).catch((err) => {
        console.log(err);
      });
  }


  async takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop() as string;
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.updateGame();

      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.updateGame();
      }, 1250);
    }

  }


  async openDialog(): Promise<void> {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe(async (name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        await this.updateGame();
      }
    });
  }

}
