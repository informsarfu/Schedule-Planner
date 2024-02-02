import { Injectable } from '@angular/core';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { addDoc, collection } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private fs: Firestore) { }

  getEvents(){
    let events = collection(this.fs,'events');
    return collectionData(events,{idField:'id'});
  }

  addEvents(title: string, date: string ){
    let new_event = { title: title, date: date };
    let events = collection(this.fs,'events');
    return addDoc(events,new_event);
  }
}