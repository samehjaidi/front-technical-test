import { Routes } from '@angular/router';
import { ListComponent } from './components/folder/list/list.component';
import { DetailsComponent } from './components/folder/details/details.component';
import { HomeComponent } from './components/home/home.component';




export const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'folders', component: ListComponent },
	{ path: 'folders/:id', component: DetailsComponent },
];