import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgcCookieConsentConfig, NgcCookieConsentModule } from 'ngx-cookieconsent';
import { Papa } from 'ngx-papaparse';
import { environment } from 'src/environments/environment';
import { AboutComponent } from './about/about.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CsseDashboardComponent } from './csse-dashboard/csse-dashboard.component';
import { ChartAreaComponent } from './dashboard/chart-area/chart-area.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Ng2ConverterService } from './dashboard/ng2-converter.service';
import { DataService } from './data.service';
import { TimeSeriesProvider } from './data/time-series.provider';

const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: environment.domain,
  },
  palette: {
    popup: {
      background: '#000',
    },
    button: {
      background: '#f1d600',
    },
  },
  theme: 'edgeless',
  type: 'info',
};

/* eslint-disable */
// AoT requires an exported function for factories
export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
/* eslint-enable */

@NgModule({
  declarations: [AppComponent, DashboardComponent, ChartAreaComponent, AboutComponent, CsseDashboardComponent],
  imports: [
    NgcCookieConsentModule.forRoot(cookieConfig),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'en',
    }),
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    environment.production ? AngularFireAnalyticsModule : [],
    MatButtonModule,
    MatMenuModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
    MatTableModule,
    MatCardModule,
    MatCheckboxModule,
    MatSortModule,
    MatPaginatorModule,
    MatTabsModule,
    MatSelectModule,
    MatSidenavModule,
    MatGridListModule,
    MatFormFieldModule,
    NgxChartsModule,
  ],
  providers: [DataService, Ng2ConverterService, Papa, TimeSeriesProvider, ScreenTrackingService, UserTrackingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
