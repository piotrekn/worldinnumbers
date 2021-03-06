import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { ChartAreaComponent } from './chart-area.component';

describe('ChartAreaComponent', () => {
  let component: ChartAreaComponent;
  let fixture: ComponentFixture<ChartAreaComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          TranslateTestingModule.withTranslations('en', require('../../../assets/i18n/en.json')).withDefaultLanguage(
            'en'
          ),
        ],
        declarations: [ChartAreaComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
