import { Component, EventEmitter, Input, Output,  } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {

  @Input() isDialogOpen = false;
  @Input() isFound = false;

  @Output() closeModal = new EventEmitter();
  @Output() saveName = new EventEmitter();

  closeDialog() {
    this.closeModal.emit();
    this.isDialogOpen = false;
  }

  saveAndCloseDialog() {
    this.saveName.emit()
    this.isDialogOpen = false;
  }
  
}
