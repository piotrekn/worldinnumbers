import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
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
