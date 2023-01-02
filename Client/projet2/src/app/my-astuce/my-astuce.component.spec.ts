import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAstuceComponent } from './my-astuce.component';

describe('MyAstuceComponent', () => {
  let component: MyAstuceComponent;
  let fixture: ComponentFixture<MyAstuceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyAstuceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyAstuceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
