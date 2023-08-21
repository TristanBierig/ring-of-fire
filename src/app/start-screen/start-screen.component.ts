import { Component, OnInit } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {
  game!: Game;
  collectionInstance = collection(this.firestore, 'games');

  constructor(private router: Router, private firestore: Firestore) { }


  ngOnInit(): void { }


  newGame() {
    this.game = new Game();
    addDoc(this.collectionInstance, this.game.toJson()).then((docRef) => {
      // Needs to be called docRef and points to the just created document
      console.log(docRef.id);
      console.log('Game created');
      this.router.navigateByUrl('/game/' + docRef.id);
    }).catch((err) => {
      console.log(err);
    }); 
  }

  
}
