import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmblemasPage } from './emblemas.page';

describe('EmblemasPage', () => {
  let component: EmblemasPage;
  let fixture: ComponentFixture<EmblemasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmblemasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
