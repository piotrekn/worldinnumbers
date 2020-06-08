import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { DataService } from '../data.service';
import { Ng2ConverterService } from './ng2-converter.service';
import { Papa } from 'ngx-papaparse';
import { GoogleChartsModule } from 'angular-google-charts';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        GoogleChartsModule,
        MatSelectModule,
        MatFormFieldModule,
        NgxChartsModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        BrowserAnimationsModule,
      ],
      declarations: [DashboardComponent],
      providers: [DataService, Ng2ConverterService, Papa],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
