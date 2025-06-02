import { AfterViewInit, Component } from '@angular/core';
import { UserSideBarComponent } from "./user-side-bar/user-side-bar.component";
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../Services/AuthService';
import { SignalRService } from '../../../Services/SignalRService';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [UserSideBarComponent, RouterOutlet],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css'
})
export class UserLayoutComponent implements AfterViewInit{
  
  name : string;
  constructor(private SignalRService: SignalRService, private router: Router){
    this.name = AuthService.getUserClaims()?.name!;
  }

  ngAfterViewInit(): void {  
    this.startSignalRConnection();
  }

  startSignalRConnection(){
    this.SignalRService.StartConnection().then(()=>{
      this.listen();
    });
  }
  
  public listen(){
    this.SignalRService.hubConnection.on('NotifyWithNewAddedProject', (message: string) => {
      this.navigateToProject();
    });
  }

  navigateToProject(){
    this.router.navigate(['/user']).then(() => {
      this.router.navigate(['/user', 'project']);
    });
  }


}
