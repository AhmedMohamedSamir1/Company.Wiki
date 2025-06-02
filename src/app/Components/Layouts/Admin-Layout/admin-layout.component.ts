import { ProjectService } from './../../../Services/ProjectService';
import { UserService } from './../../../Services/UserService';
import { HubConnectionState, Subject } from '@microsoft/signalr';
import { SignalRService } from './../../../Services/SignalRService';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AdminSideBarComponent } from "./admin-side-bar/admin-side-bar.component";
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../Services/AuthService';
import { NotificationGetDTO } from '../../../DTOs/Notification/NotificationGetDTO';
import { IApiResponse } from '../../../Interfaces/IApiResponse';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [AdminSideBarComponent, RouterOutlet, ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})

export class AdminLayoutComponent implements AfterViewInit  {

  UserId : string;
  Name: string;
  public Notifications: NotificationGetDTO[] = [];

  constructor(private SignalRService: SignalRService, private UserService: UserService, private router: Router){
    this.UserId = AuthService.getUserClaims()?.id!;
    this.Name = AuthService.getUserClaims()?.name!;

  }

  ngAfterViewInit(): void {  
      this.startSignalRConnection();
      this.getUserNotifications();
      
    }

    getUserNotifications() {
      this.UserService.getUnreadNotifications(this.UserId).subscribe({
        next: (data) => {
          this.Notifications = data;

          this.router.navigate(['/admin']).then(() => {
            this.router.navigate(['/admin', 'project']);
          });

        },
        error: (error) => { console.log(error); }
      });
    }
    
    
    startSignalRConnection(){
      this.SignalRService.StartConnection().then(()=>{
        this.listen();
      });
    }
    
    public listen(){
      this.SignalRService.hubConnection.on('NotifyWithNewAddedProject', (message: string) => {
        this.getUserNotifications();
      });
    }
  
  
    sendMessage(message: string): void {
      if (this.SignalRService.hubConnection.state === HubConnectionState.Connected) {
        this.SignalRService.hubConnection.invoke('SendMessage', message)
          .then(() => console.log('Message sent'))
          .catch(err => console.error('Error sending message:', err));
      } 
      else 
        console.error('SignalR connection is not established.');
    }


    readNotification(notificationId: number, projectId:  number){
      this.UserService.readUserNotification(notificationId).subscribe({
        next:(data: IApiResponse)=>{
          if(data.success){
            this.Notifications = this.Notifications.filter(N=>N.id !==notificationId);
            console.log(`nav is clicked ${projectId}`);
            this.router.navigate([ '/admin/project/details', projectId ]);
          }
        },
        error:(error)=>{
          console.log(error);
        }
      })
    }
}
