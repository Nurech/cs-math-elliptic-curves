import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScalarComponent } from './scalar.component';

describe('ScalarComponent', () => {
  let component: ScalarComponent;
  let fixture: ComponentFixture<ScalarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScalarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScalarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
