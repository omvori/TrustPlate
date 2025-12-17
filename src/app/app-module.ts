import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { RecensioniCards } from './recensioni-cards/recensioni-cards';
import { InputCardComponent } from './input-card/input-card';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSidenavContent, MatSidenavContainer, MatSidenav } from "@angular/material/sidenav";
import { ServizioProva } from './services/servizio-prova';
import { MatChip } from "@angular/material/chips";
import { CardsToReview } from './cards-to-review/cards-to-review';
import {MatMenuModule} from '@angular/material/menu';
import { MenuTendina } from './menu-tendina/menu-tendina';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    App,
    // Example,
    RecensioniCards,
    CardsToReview,
    MenuTendina
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    MatSidenavContent,
    MatSidenavContainer,
    MatSidenav,
    InputCardComponent,
    MatChip,
    MatMenuModule,
    MatButtonModule,
    MatFormFieldModule
],
  providers: [ServizioProva, 
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
