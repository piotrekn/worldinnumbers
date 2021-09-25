import { Component } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import '@pn/ng-rxjs-safe-subscribe';
import { RxjsOnDestroy } from 'ng-rxjs-safe-subscribe';
import { NgcCookieConsentConfig, NgcCookieConsentModule } from 'ngx-cookieconsent';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { Subject } from 'rxjs';
import { AppComponent } from './app.component';

@Component({
  selector: 'app-dashboard',
  template: '<p>Mock Dashboard Component</p>',
})
class MockDashboardComponent extends RxjsOnDestroy {}

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

  it('should use RxjsOnDestroy feature', () => {
    const component = new MockDashboardComponent();

    let count = 0;
    const subject = new Subject<number>();
    subject.subscribeSafely(component, () => {
      count++;
    });

    // start point
    expect(count).toBe(0);
    subject.next(10);
    expect(count).toBe(1);

    // destroy parent and cancel observable
    component.ngOnDestroy();

    // next value should not be triggered
    subject.next(10);
    expect(count).toBe(1);
  });

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
