import { Injectable, NgZone  } from "@angular/core";
import * as signalR from '@microsoft/signalr';
@Injectable({
    providedIn: 'root'
})

export class SignalRService{


    
    constructor(private ngZone: NgZone) { }

    public hubConnection!: signalR.HubConnection;
    
    public StartConnection():Promise<void> {

        this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7128/projectHub", { withCredentials: true  }).build();
        return this.hubConnection.start();
    }

    public CloseConnection():Promise<void> {
        return this.hubConnection.stop();
    }
}