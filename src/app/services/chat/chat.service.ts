import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  getStorage(){
    const storage = localStorage.getItem('chats');
    return storage ? JSON.parse(storage) : [];
  }

  setStorage(data:any){
    const storage = localStorage.setItem('chats',JSON.stringify(data));
  }

}


