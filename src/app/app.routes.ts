import { AllDependenciesComponent } from './Components/Dependency/all-dependencies/all-dependencies.component';
import { Routes } from '@angular/router';

import { AddTagComponent } from './Components/Tag/add-tag/add-tag.component';
import { AdminLayoutComponent } from './Components/Layouts/Admin-Layout/admin-layout.component';
import { AllTagComponent } from './Components/Tag/all-tags/all-tags.component';
import { EditTagComponent } from './Components/Tag/edit-tag/edit-tag.component';
import { AllTechnologiesComponent } from './Components/Technology/all-technologies/all-technologies.component';
import { AddTechnologyComponent } from './Components/Technology/add-technology/add-technology.component';
import { EditTechnologyComponent } from './Components/Technology/edit-technology/edit-technology.component';
import { AddDependencyComponent } from './Components/Dependency/add-dependency/add-dependency.component';
import { EditDependencyComponent } from './Components/Dependency/edit-dependency/edit-dependency.component';
import { AddProjectComponent } from './Components/Project/add-project/add-project.component';
import { AllProjectsComponent } from './Components/Project/all-projects/all-projects.component';
import { EditProjectComponent } from './Components/Project/edit-project/edit-project.component';
import { RegisterComponent } from './Components/User/register/register.component';
import { LoginComponent } from './Components/User/login/login.component';
import { adminGaurd } from './Guards/AdminGuard';
import {  userGuard } from './Guards/UserGuard';
import { UserLayoutComponent } from './Components/Layouts/User-Layout/user-layout.component';
import { ProjectDetailsComponent } from './Components/Project/project-details/project-details.component';
import { ForgetPasswordComponent } from './Components/User/forget-password/forget-password.component';
import { ResetPasswordComponent } from './Components/User/reset-password/reset-password.component';
import { AddAdminComponent } from './Components/User/add-admin/add-admin.component';
import { AddUserComponent } from './Components/User/add-user/add-user.component';

export const routes: Routes = [

    {
        path: 'admin',
        canActivate: [adminGaurd],
        component: AdminLayoutComponent,
        children:[

            {path: '', component: AllProjectsComponent},
            {path: 'project', component: AllProjectsComponent},
            {path: 'project/add', component: AddProjectComponent},
            {path: 'project/edit/:id', component: EditProjectComponent },
            {path: 'project/details/:id', component: ProjectDetailsComponent},

            { path:'tag', component: AllTagComponent },
            { path:'tag/add', component: AddTagComponent },
            { path:'tag/edit/:id', component: EditTagComponent },
            
            { path:'technology', component: AllTechnologiesComponent },
            { path:'technology/add', component: AddTechnologyComponent },
            { path:'technology/edit/:id', component: EditTechnologyComponent },

            { path:'dependency', component: AllDependenciesComponent },
            { path:'dependency/add', component: AddDependencyComponent},
            { path:'dependency/edit/:id', component: EditDependencyComponent },

            { path:'user/addAdmin', component: AddAdminComponent },
            { path:'user/addUser', component: AddUserComponent },

        ]
    },

    
    {
        path: 'user',
        canActivate: [userGuard],
        component: UserLayoutComponent,
        children:[

            {path:  '', component: AllProjectsComponent},
            {path:  'project', component: AllProjectsComponent},
            {path:  'project/add', component: AddProjectComponent},
            { path: 'project/edit/:id', component: EditProjectComponent },
            { path: 'project/details/:id', component: ProjectDetailsComponent },
            
            { path:'tag', component: AllTagComponent },
            { path:'tag/add', component: AddTagComponent },
            { path:'tag/edit/:id', component: EditTagComponent },
            
            { path:'technology', component: AllTechnologiesComponent },
            { path:'technology/add', component: AddTechnologyComponent },
            { path:'technology/edit/:id', component: EditTechnologyComponent },

            { path:'dependency', component: AllDependenciesComponent },
            { path:'dependency/add', component: AddDependencyComponent},
            { path:'dependency/edit/:id', component: EditDependencyComponent },

        ]
    },


    {path: '', component: RegisterComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},
    {path: 'forgetPassword', component: ForgetPasswordComponent},
    {path: 'resetPass', component: ResetPasswordComponent},
    { path: '**', redirectTo: '/login', pathMatch: 'full' }
];
