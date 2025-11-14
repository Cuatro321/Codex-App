import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnemigosPage } from './enemigos.page';

describe('EnemigosPage', () => {
  let component: EnemigosPage;
  let fixture: ComponentFixture<EnemigosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EnemigosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
