import { Injectable } from '@angular/core';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { addDoc, collection } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private fs: Firestore) { }

  getEvents(){
    let events = collection(this.fs,'content');
    return collectionData(events,{idField:'id'});
  }

  addEvents(title: string, date: string, time: string ){
    let new_event = { title: title, date: date, time: time };
    let events = collection(this.fs,'content');
    console.log(new_event);
    return addDoc(events,new_event);
  }
}
