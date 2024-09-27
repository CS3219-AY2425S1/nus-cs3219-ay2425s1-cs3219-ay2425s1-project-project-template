import { Routes } from '@angular/router';
import { AddPageComponent } from "../add-page/add-page.component";
import {EditPageComponent} from "../edit-page/edit-page.component";

export const routes: Routes = [
  {path: 'add-question', component: AddPageComponent},
  {path: 'edit-question', component: EditPageComponent}
];
