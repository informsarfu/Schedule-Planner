import { Injectable } from '@angular/core';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { doc, addDoc, collection, getDoc, setDoc, getDocs } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})

export class SharedService {

  constructor(private fs: Firestore) { }

  async getEvents(): Promise<any[]> {
    const userKey = await this.getUserKey();
    const eventsCollection = collection(this.fs, 'users', userKey, 'events');
    const eventsSnapshot = await getDocs(eventsCollection);
    const events: any[] = [];
    
    eventsSnapshot.forEach(doc => {
        events.push({ id: doc.id, ...doc.data() });
    });

    return events;
}

  async addEvents(title: string, date: string, time: string) {
    const userKey = await this.getUserKey();
    // console.log(userKey)
    const newEvent = { title: title, date: date, time: time };

    const userCollection = collection(this.fs, 'users', userKey, 'events');
    return addDoc(userCollection, newEvent);
  }

  private async getUserKey(): Promise<string> {
    const userKeyinDoc = doc(this.fs, 'userKeys', 'userKey');
    const userKeyinDocSnap = await getDoc(userKeyinDoc);

    if (userKeyinDocSnap.exists()) {
      return userKeyinDocSnap.data()['key'];
    } 
    else {
      const newUserKey = this.generateUserKey();
      await setDoc(userKeyinDoc, { key: newUserKey });
      return newUserKey;
    }
  }

  private generateUserKey(): string {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  }
}
