import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Papa } from 'ngx-papaparse';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { NEVER } from 'rxjs';
import { DataService } from '../data.service';
import { TimeSeriesProvider } from '../data/time-series.provider';
import { ChartAreaComponent } from './chart-area/chart-area.component';
import { DashboardComponent } from './dashboard.component';
import { Ng2ConverterService } from './ng2-converter.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          TranslateTestingModule.withTranslations('en', require('../../assets/i18n/en.json')).withDefaultLanguage('en'),
          MatCheckboxModule,
          MatSelectModule,
          MatFormFieldModule,
          NgxChartsModule,
          MatInputModule,
          MatTableModule,
          MatCardModule,
          MatSortModule,
          MatPaginatorModule,
          MatTabsModule,
          MatSelectModule,
          MatFormFieldModule,
          BrowserAnimationsModule,
          RouterTestingModule,
        ],
        declarations: [DashboardComponent, ChartAreaComponent],
        providers: [
          DataService,
          Ng2ConverterService,
          Papa,
          { provide: TimeSeriesProvider, useValue: jasmine.createSpyObj('TimeSeriesProvider', ['getTimeSeries']) },
        ],
      }).compileComponents();

      const timeSeriesProvider = TestBed.inject(TimeSeriesProvider) as jasmine.SpyObj<TimeSeriesProvider>;
      timeSeriesProvider.getTimeSeries.and.returnValue(NEVER);
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
