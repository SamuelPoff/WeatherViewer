import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentWeatherViewComponent } from './current-weather-view.component';

describe('CurrentWeatherViewComponent', () => {
  let component: CurrentWeatherViewComponent;
  let fixture: ComponentFixture<CurrentWeatherViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentWeatherViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentWeatherViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
