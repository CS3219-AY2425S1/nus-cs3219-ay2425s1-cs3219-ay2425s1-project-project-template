import { Component } from '@angular/core';
import {EditPageComponent} from "../../edit-page/edit-page.component";
import {MatDialog} from "@angular/material/dialog";
import {AddPageComponent} from "../../add-page/add-page.component";

@Component({
  selector: 'app-search-and-filter',
  standalone: true,
  imports: [],
  templateUrl: './search-and-filter.component.html',
  styleUrl: './search-and-filter.component.css'
})
export class SearchAndFilterComponent {
  constructor(private dialog: MatDialog) {}
  openAddModal() {
    this.dialog.open(AddPageComponent, {
      panelClass: 'custom-modalbox',
      width: '800px',
      height: '600px',
      position: {
        top: '200px',
      },
      disableClose: true
    });
  }
}
