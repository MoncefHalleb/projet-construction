import { Component, Inject, OnInit } from '@angular/core';
import { UserServiceService } from '../../Services/UserService/user-service.service';
interface NavItem {
  label: string;
  link: string;
  icon: string;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit{
  userNavBar: NavItem[] = [
    { label: 'Reclamation', link: 'reclamation', icon: 'fas fa-comment-dots' },
    { label: 'File Upload', link: 'fileupload', icon: 'fas fa-upload' },
    { label: 'Profile', link: 'profile', icon: 'fas fa-user' }
  ];
  email: string = '';

  adminNavBar: NavItem[] = [
    { label: 'Users', link: '/users', icon: 'fas fa-users' }
  ];

  navBar: NavItem[] = [];

  constructor(@Inject(UserServiceService) private userService: UserServiceService,
) {}

  async ngOnInit(): Promise<void> {
    try {
      const predefinedRole = await this.userService.getPredefinedRole();
      const userInfo = await this.userService.getCurrentUser();
      console.log("🚀 ~ SidenavComponent ~ ngOnInit ~ userInfo:", userInfo)
      this.email = userInfo.email;
      this.adminNavBar = [
        { label: 'list rec', icon: 'fas fa-user-edit', link: `reclamationList` }, 

      ];
      this.navBar = predefinedRole === "user" ? this.userNavBar : this.adminNavBar;
     
    } catch (error) {
      console.error("Error fetching predefined role:", error);
    }
  }
}