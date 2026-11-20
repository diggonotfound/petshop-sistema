import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Dashboard } from './pages/dashboard/dashboard';
import { Clientes } from './pages/clientes/clientes';
import { Animais } from './pages/animais/animais';
import { provideHttpClient } from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [App, Dashboard, Clientes, Animais],
  imports: [BrowserModule, AppRoutingModule,MatCardModule,MatSidenavModule,MatListModule,MatIconModule,MatFormFieldModule,MatInputModule,MatButtonModule,FormsModule],
  providers: [provideBrowserGlobalErrorListeners(), provideClientHydration(),provideHttpClient()],
  bootstrap: [App],
})
export class AppModule {}
