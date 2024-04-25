import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from './services/chat/chat.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('popup', { static: false }) popup: any;

  public roomId: any;
  public messageText: any;
  public messageArray: any = [];

  public showScreen: boolean = false;
  public showChat: boolean = false;
  public phone: any;
  public currentUser: any;
  public selectedUser: any;
  public formattedDate: any;


  private storageArray: any[] = [];


  public userList = [
    {
      id: 1,
      name: 'Rony Weter',
      phone: '71644187',
      image: 'assets/user/rony.png',
      roomId: 'room1'
    },
    {
      id: 2,
      name: 'Nathalie Nicolas',
      phone: '70123456',
      image: 'assets/user/nadine.png',
      roomId: 'room2'
    },
    {
      id: 3,
      name: 'Nadine Nicolas',
      phone: '71932303',
      image: 'assets/user/nadine.png',
      roomId: 'room3'
    }
  ]
  constructor(
    private modalService: NgbModal,
    private chatService: ChatService) {
  }

  ngAfterViewInit(): void {
    this.openPopup(this.popup);
  }

  openPopup(content: any): void {
    this.modalService.open(content, { backdrop: 'static', centered: true });
  }

  ngOnInit(): void {
    this.showChat = false;
  }

  login(dismiss: any): void {
    this.currentUser = this.userList.find(user => user.phone === this.phone.toString());
    this.userList = this.userList.filter((user) => user.phone !== this.phone.toString());

    if (this.currentUser) {
      this.showScreen = true;
      dismiss();
    }


  }

  selectUserHandler(phone: string): void {

    this.selectedUser = this.userList.find(user => user.phone === phone);
    this.roomId = this.selectedUser.roomId;
    this.messageArray = [];
    this.storageArray = this.chatService.getStorage();




    for (let i = 0; i < this.storageArray.length; i++) {

      const date = new Date(this.storageArray[i].chats[0].date);
      const hours = ("0" + date.getHours()).slice(-2); // Ensure leading zero if needed
      const minutes = ("0" + date.getMinutes()).slice(-2); // Ensure leading zero if needed
      const time = `${hours}:${minutes}`;
      const hours1 = date.getHours();
      const period = hours1 >= 12 ? 'PM' : 'AM';
      let finalDate = time + " " + period;

      this.formatTime(finalDate);
      if (this.storageArray[i].chats[0].fromRoomId == this.roomId && this.currentUser.phone == this.storageArray[i].chats[0].toPhone) {
        let item: any = {
          message: this.storageArray[i].chats[0].message,
          type: "from",
          date: this.formatTime(finalDate)
        };
        this.messageArray.push(item);
      }
      if (this.storageArray[i].chats[0].toRoomId == this.roomId && this.currentUser.phone == this.storageArray[i].chats[0].phone) {
        let item: any = {
          message: this.storageArray[i].chats[0].message,
          type: "to",
          date: this.formatTime(finalDate)
        };
        this.messageArray.push(item);
      }
    }
    console.log("this.messageArray=", this.messageArray);

    this.showChat = true;



  }


  sendMessage(): void {

    if (this.messageText) {
      let currentDate = new Date();
      let toUser = this.userList.find(user => user.roomId === this.roomId);
      console.log("1111", this.currentUser);
     

      this.storageArray = this.chatService.getStorage();
      const storeIndex = this.storageArray.findIndex((storage) => storage.roomId === this.roomId);
      console.log("storeIndex=", storeIndex);
      if (storeIndex > -1) {
        this.storageArray[storeIndex].chats.push({
          user: this.currentUser.name,
          toRoomId: toUser?.roomId,
          fromRoomId: this.currentUser.roomId,
          message: this.messageText,
          phone: this.currentUser.phone,
          toPhone: toUser?.phone,
          date: currentDate.toString()
        });
      } else {
        const updateStorage = {
          chats: [{
            user: this.currentUser.name,
            toRoomId: toUser?.roomId,
            fromRoomId: this.currentUser.roomId,
            message: this.messageText,
            phone: this.currentUser.phone,
            toPhone: toUser?.phone,
            date: currentDate.toString()
          }]
        };

        this.storageArray.push(updateStorage);
      }
      this.chatService.setStorage(this.storageArray);
      this.messageText = '';
      this.selectUserHandler(this.selectedUser.phone);
    }
  }

  formatTime(timeString: any) {
    const [time, period] = timeString.split(" ");
    const [hoursStr, minutesStr] = time.split(":");

    // Parse hours and minutes as integers
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    // Convert hours to 12-hour format and adjust the period
    let period1 = '';
    if (hours >= 12) {
      period1 = 'pm';
      if (hours > 12) {
        hours -= 12;
      }
    } else {
      period1 = 'am';
      if (hours === 0) {
        hours = 12;
      }
    }
    const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
    return formattedTime;
  }
}

