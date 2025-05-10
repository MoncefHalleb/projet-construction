// all-files.component.ts

import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../../Services/file-upload.service';

@Component({
  selector: 'app-all-files',
  templateUrl: './all-files.component.html',
  styleUrls: ['./all-files.component.css']
})
export class AllFilesComponent implements OnInit {
  files: any[] = [];

  constructor(private fileUploadService: FileUploadService) { }

  ngOnInit(): void {
    this.fetchFiles();
  }

  fetchFiles(): void {
    this.fileUploadService.getFiles()
      .subscribe(files => {
        this.files = files;
      });
  }
}
