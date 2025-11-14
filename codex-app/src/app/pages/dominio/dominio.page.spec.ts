import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DominioPage } from './dominio.page';

describe('DominioPage', () => {
  let component: DominioPage;
  let fixture: ComponentFixture<DominioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DominioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
