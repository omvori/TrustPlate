import { Component } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { MenuData } from '../services/menu-data';

@Component({
  selector: 'app-menu-tendina',
  standalone: false,
  templateUrl: './menu-tendina.html',
  styleUrl: './menu-tendina.css',
})
export class MenuTendina {

  constructor(private _menudata: MenuData){}

  send_1(){}

}
