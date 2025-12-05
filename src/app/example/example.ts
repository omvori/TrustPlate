import { Component } from '@angular/core';
import { MatToolbar } from "@angular/material/toolbar";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-example',
  templateUrl: './example.html',  
  styleUrls: ['./example.css']   
  ,
  imports: [MatToolbar, MatIcon]
})
export class ExampleComponent {  
}