import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogData} from '../home/home.component';
import {AppService} from '../app.service';



@Component({
  selector: 'app-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.css']
})
export class CreateDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private service : AppService) {}

    name : String;
    file : Boolean;
    uploadForm: FormGroup;  


  ngOnInit() {
    if(this.data.type == 'file'){
      this.file=true;
    }
    this.uploadForm = this.formBuilder.group({
      file: ['']
    });
  }

  
  onNoClick(): void {
    this.dialogRef.close();
  }

  create(){
    if(this.file){
      const formData = new FormData();
      formData.append('file', this.uploadForm.get('file').value);
      this.service.createFile(this.data.path,formData).subscribe((data) =>{
        console.log("File Uploaded");
        this.dialogRef.close();
      })
    }else{
      let folder = {name : this.name, type : 'folder', size : 0};
      console.log(folder, this.data.path);
      this.service.createFolder(folder,this.data.path).subscribe((res) =>{
        this.dialogRef.close();
      });
    }
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('file').setValue(file);
    }
  }

}
