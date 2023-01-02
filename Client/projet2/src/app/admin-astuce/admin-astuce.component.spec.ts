import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAstuceComponent } from './admin-astuce.component';

describe('AdminAstuceComponent', () => {
  let component: AdminAstuceComponent;
  let fixture: ComponentFixture<AdminAstuceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAstuceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAstuceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
