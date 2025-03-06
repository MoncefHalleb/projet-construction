import {Component, OnInit} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {FileUploadService} from "../../../Services/FileUploadService/file-upload.service";

@Component({
  selector: 'app-accounts-uploader',
  templateUrl: './accounts-uploader.component.html',
  styleUrl: './accounts-uploader.component.css'
})
export class AccountsUploaderComponent  implements OnInit {

  currentFile?: File;
  message = '';
  constructor(private fileUploadService: FileUploadService,private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  onFileSelected(event: any) {
    this.currentFile = event.target.files[0];
  }


  upload() {
    this.fileUploadService.uploadFile(this.currentFile).subscribe(
      response => {
        if (response.success) {
          console.log(response.message);
          this.toastr.success(response.message, 'Success');
          this.message = response.message;
        } else {
          console.log(response.message);
          this.message = response.message;
          this.message.split("\n").forEach((msg: string) => {
            this.toastr.error(msg, 'Error');
          });
        }
      },
      error => {
        console.log(error);
        this.message = 'Could not upload the file!';
      }
    )
  }
}
