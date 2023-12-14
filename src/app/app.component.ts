import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Where am I?';

  public formOpen = false;

  isDialogOpen = false;

  openForm() {
    this.formOpen = true;
    console.log("opening Form")
    
  }

  closeForm() {
    console.log("closing Form")
    this.formOpen = false;
  }

  toggleModal() {
    this.isDialogOpen = !this.isDialogOpen
  }


}