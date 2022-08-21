import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherDataDetailsComponent } from './weather-data-details.component';

describe('WeatherDataDetailsComponent', () => {
  let component: WeatherDataDetailsComponent;
  let fixture: ComponentFixture<WeatherDataDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeatherDataDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeatherDataDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
