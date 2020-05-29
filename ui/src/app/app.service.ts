import { Injectable } from '@angular/core';
import {HttpClient, } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http:HttpClient) { }

  fetchData(path){
    let url = `http://host.docker.internal:8080/folder?path=${path}`;
    return this.http.get<any>(url);
  }

  downloadFile(filename){
    let url = `http://host.docker.internal:8080/file?filename=${filename}`
		return this.http.get(url, {responseType : 'blob'});
  }

  createFolder(folder,path){
    console.log(path);
    let url = `http://host.docker.internal:8080/folder?path=${path}`;
    return this.http.post<any>(url,folder);
  }

  createFile(path, formData){
    let url = `http://host.docker.internal:8080/file?path=${path}`;
    return this.http.post<any>(url,formData);

  }

  removeItem(item, path){
    let url = `http://host.docker.internal:8080/remove/${item.type}?path=${path}`;
    return this.http.post<any>(url,item);
  }
}
