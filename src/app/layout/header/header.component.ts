import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor() { }

  ngOnInit(): void {
    // Initialization logic can go here if needed
    console.log('HeaderComponent initialized');
  }
}

