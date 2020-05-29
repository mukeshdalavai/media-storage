import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AppService} from '../app.service';
import * as fileSaver from 'file-saver';
import * as humanizeData from 'humanize-data';
import { CreateDialogComponent } from '../create-dialog/create-dialog.component';

export interface DialogData {
  type: string;
  path: String;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private service:AppService, public dialog:MatDialog) { }

  data : any;
  path : String;
  value : String;

  ngOnInit() {
    this.value = "";
    this.path = "";
    this.fetchFolders();
  }

  downloadFile(filename, name){
    this.service.downloadFile(filename).subscribe((data) =>{
      let blobData = new Blob([data], {type : 'application/octet-stream'});
      // console.log(blobData);
      fileSaver.saveAs(blobData, name);
    })
  }

  fetchFolders(){
    this.service.fetchData(this.path).subscribe(data => {
      console.log(data);
      this.data = data;
      for(let fol of data.folders){
        fol.humanized = humanizeData(fol.size);
      }
      for(let file of data.files){
        file.humanized = humanizeData(file.size);
      }
    })
  }

  front(name){
    this.path = this.path + `/${name}`;
    this.fetchFolders();
  }

  back(){
    this.path = this.path.slice(0,this.path.lastIndexOf('/'));
    this.fetchFolders();
  }

  searchFolders(){
    this.path = this.value;
    this.fetchFolders();
  }

  openDialog(type): void {
    const dialogRef = this.dialog.open(CreateDialogComponent, {
      width: '250px',
      data: {type : type, path : this.path}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.fetchFolders();
    });
  }

  removeItem(data){
    let type = "";
    if(data.type != 'folder'){
      type = "file";
    }else{
      type = data.type;
    }
    let item = {name : data.name , type : type, size : Number(data.size)};
    this.service.removeItem(item, this.path).subscribe((data) =>{
      console.log(`${item.type} deleted`);
      this.fetchFolders();
    })
  }

}
