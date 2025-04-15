import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hr-profile',
  templateUrl: './hr-profile.component.html',
  styleUrls: ['./hr-profile.component.css'],
})
export class HrProfileComponent {
  user: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {}
}
