import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

export interface Item{
  name : string;
  id : string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  inputFormData= new FormGroup({
    name : new FormControl('')//,
  });
  updateData : Boolean;
  currentUpdateId : string;
  itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  constructor(private db: AngularFirestore, public afAuth: AngularFireAuth) {
    this.itemsCollection= db.collection<Item>('items');
    this.items = this.itemsCollection.snapshotChanges().pipe(
      map( actions => actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return {...data, id}; 
      }))
      );
      this.updateData = false;
      this.currentUpdateId = "";
    }
    addData() : void  {
      var ra_id: string ;
      if(!this.updateData){ 
        ra_id = this.db.createId();
        this.itemsCollection.doc(ra_id).set(this.inputFormData.value);
      } else {
        this.updateData= false;
        ra_id = this.currentUpdateId;
        this.currentUpdateId = "";
        this.itemsCollection.doc(ra_id).update(this.inputFormData.value);
      }  
      this.inputFormData.reset();
    }
    
    deleteItem(id : string) : void {
      this.itemsCollection.doc(id).delete();
    }
    
    editData(item : Item): void {
      this.inputFormData.setValue({name: item.name});
      this.updateData = true;
      this.currentUpdateId =item.id;
    }
    login() {
      try {
        this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
        
      }
      catch (e){
        console.log(e);
      }
    }
    logout() {
      this.afAuth.auth.signOut();
    }
  }
  
  //   id : new FormControl('')
  //this.items = this.itemsCollection.valueChanges();
//this.inputFormData.id = ra_id;
//console.log(this.inputFormData);

//  const random_id = db.createId();
  //this.addItemToCollection(random_id);

// addItemToCollection(id: any) : void  {
//  // this.itemsCollection.add({name : "userTestDetails"});
//   this.itemsCollection.doc(id).set({name : "honor lite" +id });
// }
//  private itemDoc: AngularFirestoreDocument<Item>;
// for playing with documents
// this.itemDoc = db.doc<Item>('items/userDetails');
// this.itemDoc.set({name : "Nomad"});
// this.itemDoc.delete();
// this.item = this.itemDoc.valueChanges();
// console.log(this.item.subscribe({
//   next (value ) { console.log(value);},
// }));
