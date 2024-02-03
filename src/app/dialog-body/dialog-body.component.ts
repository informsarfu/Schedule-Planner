import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-body',
  templateUrl: './dialog-body.component.html',
  styleUrls: ['./dialog-body.component.css']
})
export class DialogBodyComponent implements OnInit {
  @Input() data: any;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any, public dialogRef: MatDialogRef<DialogBodyComponent>) { }

  ngOnInit(): void {
    console.log("Dialog Body Data:", this.dialogData);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
