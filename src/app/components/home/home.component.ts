import { Component } from '@angular/core';
import { SharedModules } from "../../shared/shared-module";
import { Router } from '@angular/router';
@Component({
  selector: 'ic-home',
  imports: [SharedModules],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private router: Router) { }
  navigateToFolders(): void {
    this.router.navigate(['/folders']);
  }

}
