import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAstuceComponent } from './add-astuce.component';

describe('AddAstuceComponent', () => {
  let component: AddAstuceComponent;
  let fixture: ComponentFixture<AddAstuceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAstuceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAstuceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
