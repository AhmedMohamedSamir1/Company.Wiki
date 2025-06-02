export interface NotificationGetDTO{
    id: number;
    message: string;
    isRead:boolean;
    userId:string;
    projectId: number;
    createdDate: Date;
}