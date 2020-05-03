import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { DashboardComponent } from './dashboard/dashboard.component';
import {
  MatToolbarModule,
  MatTableModule,
  MatSelectModule,
  MatFormFieldModule,
  MatSortModule,
  MatGridListModule,
  MatCardModule,
  MatPaginatorModule,
} from '@angular/material';
import { GoogleChartsModule } from 'angular-google-charts';
import { DataService } from './data.service';
import { Ng2ConverterService } from './dashboard/ng2-converter.service';
import { Papa } from 'ngx-papaparse';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [AppComponent, DashboardComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    GoogleChartsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    MatToolbarModule,
    MatTableModule,
    MatCardModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    MatGridListModule,
    MatFormFieldModule,
    NgxChartsModule,
  ],
  providers: [DataService, Ng2ConverterService, Papa],
  bootstrap: [AppComponent],
})
export class AppModule {}
