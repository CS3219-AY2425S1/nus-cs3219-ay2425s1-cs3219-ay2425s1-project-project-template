import {Component, EventEmitter, Output} from '@angular/core';
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
  @Output() refresh = new EventEmitter<void>();

  constructor(private dialog: MatDialog) {}
  openAddModal() {
    const dialogRef = this.dialog.open(AddPageComponent, {
      panelClass: 'custom-modalbox',
      width: '800px',
      height: '600px',
      position: {
        top: '200px',
      },
      disableClose: true
    });

    dialogRef.componentInstance.addComplete.subscribe(() => {
      this.refresh.emit();
    });
  }
}
