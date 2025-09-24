import { Routes } from '@angular/router';
import { ListComponent } from './components/folder/list/list.component';
import { DetailsComponent } from './components/folder/details/details.component';




export const routes: Routes = [
	{ path: '', component:  ListComponent },
	{ path: 'folders', component: ListComponent },
	{ path: 'folders/:id', component:  DetailsComponent },
];