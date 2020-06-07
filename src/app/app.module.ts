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
  MatTabsModule,
  MatCheckboxModule,
  MatInputModule,
} from '@angular/material';
import { DataService } from './data.service';
import { Ng2ConverterService } from './dashboard/ng2-converter.service';
import { Papa } from 'ngx-papaparse';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartAreaComponent } from './dashboard/chart-area/chart-area.component';

@NgModule({
  declarations: [AppComponent, DashboardComponent, ChartAreaComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    MatInputModule,
    MatToolbarModule,
    MatTableModule,
    MatCardModule,
    MatCheckboxModule,
    MatSortModule,
    MatPaginatorModule,
    MatTabsModule,
    MatSelectModule,
    MatGridListModule,
    MatFormFieldModule,
    NgxChartsModule,
  ],
  providers: [DataService, Ng2ConverterService, Papa],
  bootstrap: [AppComponent],
})
export class AppModule {}
