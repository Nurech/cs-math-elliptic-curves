import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldAdditionComponent } from './field-addition.component';

describe('FieldAdditionComponent', () => {
  let component: FieldAdditionComponent;
  let fixture: ComponentFixture<FieldAdditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldAdditionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldAdditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
