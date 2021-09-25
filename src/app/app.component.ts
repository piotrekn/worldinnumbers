import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { RxjsOnDestroy } from 'ng-rxjs-safe-subscribe';
import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import packageInfo from '../../package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends RxjsOnDestroy implements OnDestroy, OnInit {
  title = 'World in numbers';
  version = packageInfo.version;
  language: string;
  languages = ['en', 'pl'];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay()
  );

  constructor(
    private ccService: NgcCookieConsentService,
    private translateService: TranslateService,
    private breakpointObserver: BreakpointObserver,
    private metaService: Meta
  ) {
    super();
  }

  ngOnInit() {
    this.translateService.addLangs(this.languages);
    this.changeLanguage(this.getLanguage());

    // Support for translated cookies messages
    this.translateService
      .get([
        'cookie.header',
        'cookie.message',
        'cookie.dismiss',
        'cookie.allow',
        'cookie.deny',
        'cookie.link',
        'cookie.policy',
      ])
      .subscribeSafely(this, (data) => {
        this.ccService.getConfig().content = this.ccService.getConfig().content || {};
        // Override default messages with the translated ones
        this.ccService.getConfig().content.header = data['cookie.header'];
        this.ccService.getConfig().content.message = data['cookie.message'];
        this.ccService.getConfig().content.dismiss = data['cookie.dismiss'];
        this.ccService.getConfig().content.allow = data['cookie.allow'];
        this.ccService.getConfig().content.deny = data['cookie.deny'];
        this.ccService.getConfig().content.link = data['cookie.link'];
        this.ccService.getConfig().content.policy = data['cookie.policy'];

        this.ccService.destroy(); // remove previous cookie bar (with default messages)
        this.ccService.init(this.ccService.getConfig()); // update config with translated messages
      });
  }

  changeLanguage(language: string) {
    const newLanguage = this.languages.includes(language) ? language : 'en';
    if (this.language === newLanguage) {
      return;
    }
    this.language = newLanguage;
    this.translateService.use(newLanguage);
    this.setLanguage(newLanguage);
    this.updateTags();
  }

  private getLanguage() {
    return localStorage.getItem(`${environment.domain}.language`) ?? this.translateService.getBrowserLang();
  }

  private setLanguage(language: string) {
    return localStorage.setItem(`${environment.domain}.language`, language);
  }

  private updateTags() {
    this.translateService.get(['tags.keywords', 'tags.description']).subscribeSafely(this, (data) => {
      const tags = [
        { name: 'keywords', content: data['tags.keywords'] },
        { name: 'description', content: data['tags.description'] },
      ];
      this.metaService.updateTag(tags[0]);
      this.metaService.updateTag(tags[1]);
    });
  }
}
