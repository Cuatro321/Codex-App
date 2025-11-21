import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { EmblemasPage } from './emblemas.page';
import { CodexService, Emblem } from '../../services/codex.service';

describe('EmblemasPage', () => {
  let component: EmblemasPage;
  let fixture: ComponentFixture<EmblemasPage>;
  let codexServiceSpy: jasmine.SpyObj<CodexService>;

  beforeEach(async () => {
    codexServiceSpy = jasmine.createSpyObj<CodexService>('CodexService', ['getEmblems']);

    await TestBed.configureTestingModule({
      declarations: [EmblemasPage],
      imports: [CommonModule],
      providers: [{ provide: CodexService, useValue: codexServiceSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    codexServiceSpy.getEmblems.and.returnValue(of([] as Emblem[]));

    fixture = TestBed.createComponent(EmblemasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load emblems on init', () => {
    expect(codexServiceSpy.getEmblems).toHaveBeenCalled();
  });
});
