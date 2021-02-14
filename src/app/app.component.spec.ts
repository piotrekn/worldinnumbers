import { Component } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgcCookieConsentConfig, NgcCookieConsentModule } from 'ngx-cookieconsent';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { AppComponent } from './app.component';

@Component({
  selector: 'app-dashboard',
  template: '<p>Mock Dashboard Component</p>',
})
class MockDashboardComponent {}

describe('AppComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          NgcCookieConsentModule.forRoot({} as NgcCookieConsentConfig),
          TranslateTestingModule.withTranslations('en', require('../assets/i18n/en.json')).withDefaultLanguage('en'),
          MatIconModule,
          MatListModule,
          MatToolbarModule,
          MatSelectModule,
          MatSidenavModule,
          NoopAnimationsModule,
        ],
        declarations: [AppComponent, MockDashboardComponent],
      }).compileComponents();
    })
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'World in numbers'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('World in numbers');
  });
});
