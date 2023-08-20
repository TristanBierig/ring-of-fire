import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Game } from 'src/models/game';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Observable } from 'rxjs';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

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
  currentGame: any;
  private firestore: Firestore = inject(Firestore);

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    this.itemCollection = collection(this.firestore, 'games');
    this.games$ = collectionData(this.itemCollection);
  }


  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      this.games$.subscribe((newGame) => {
        const id = params['id'];
        this.currentGame = newGame.id;
        console.log(params['id']);
        console.log(this.currentGame);
      });
    });
  }


  newGame() {
    this.game = new Game();
    // setDoc(doc(this.itemCollection), this.game.toJson());
  }


  takeCard() {
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
