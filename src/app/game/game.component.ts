import { Component, OnInit, Input, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Game } from 'src/models/game';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Observable } from 'rxjs';
import { Firestore, collection, collectionData, doc, getDoc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { __values } from 'tslib';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
  game!: Game;
  itemCollection: any;

  games$: Observable<any>;
  games: Array<string> = [];
  public currentGameId!: string;
  public currentGame!: any;
  private firestore: Firestore = inject(Firestore);

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    this.itemCollection = collection(this.firestore, 'games');
    this.games$ = collectionData(this.itemCollection);
  }


  ngOnInit(): void {
    this.loadGame();
    this.updateGame();
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
  }


  async updateGame() {
    this.currentGame = onSnapshot(doc(this.firestore, "games", this.currentGameId), (doc) => {
      console.log("Current data: ", doc.data());
      this.currentGame = doc.data();
      this.game = this.currentGame;
    });
  }


  async takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop() as string;
      this.pickCardAnimation = true;
      console.log('New Card:' + this.currentCard)
      console.log(this.game);

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;

      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1250);
    }

    const docRef = doc(this.firestore, 'games', this.currentGameId);
    const updateData = JSON.stringify(this.game);
    await updateDoc(docRef, updateData);
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }

}
