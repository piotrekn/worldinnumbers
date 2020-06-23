import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
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
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Papa } from 'ngx-papaparse';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChartAreaComponent } from './dashboard/chart-area/chart-area.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Ng2ConverterService } from './dashboard/ng2-converter.service';
import { DataService } from './data.service';
import { TimeSeriesProvider } from './data/time-series.provider';

@NgModule({
  declarations: [AppComponent, DashboardComponent, ChartAreaComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
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
  providers: [DataService, Ng2ConverterService, Papa, TimeSeriesProvider],
  bootstrap: [AppComponent],
})
export class AppModule {}
