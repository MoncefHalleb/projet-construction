import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ApiResponse} from "../../Modules/UserModule/ApiResponse";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  // API url
  baseApiUrl = "http://localhost:9090/api/service/user"

  constructor(private http:HttpClient) { }


  uploadFile(file: File | undefined) {
    const formData = new FormData();
    // @ts-ignore
    formData.append('file', file);
    return this.http.post<ApiResponse<any>>(this.baseApiUrl + '/CreateUsersFromExcel', formData);

  }
}
