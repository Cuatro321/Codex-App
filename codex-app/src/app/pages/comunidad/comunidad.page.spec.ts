import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ComunidadPage } from './comunidad.page';

describe('ComunidadPage', () => {
  let component: ComunidadPage;
  let fixture: ComponentFixture<ComunidadPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComunidadPage],
      imports: [CommonModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ComunidadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
