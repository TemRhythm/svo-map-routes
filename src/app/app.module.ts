import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SvgPathPipe } from './svg-path.pipe';
import { MapRoutingModule } from '../map-routing/map-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    SvgPathPipe
  ],
  imports: [
    BrowserModule,
    MapRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
