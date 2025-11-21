import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { DominioPage } from './dominio.page';
import { CodexService, Domain } from '../../services/codex.service';

describe('DominioPage', () => {
  let component: DominioPage;
  let fixture: ComponentFixture<DominioPage>;
  let codexServiceSpy: jasmine.SpyObj<CodexService>;

  beforeEach(async () => {
    codexServiceSpy = jasmine.createSpyObj<CodexService>('CodexService', ['getDomains']);

    await TestBed.configureTestingModule({
      declarations: [DominioPage],
      imports: [CommonModule],
      providers: [{ provide: CodexService, useValue: codexServiceSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    codexServiceSpy.getDomains.and.returnValue(of([] as Domain[]));

    fixture = TestBed.createComponent(DominioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load domains on init', () => {
    expect(codexServiceSpy.getDomains).toHaveBeenCalled();
  });
});
