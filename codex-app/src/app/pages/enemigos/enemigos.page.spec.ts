import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { EnemigosPage } from './enemigos.page';
import { CodexService, Enemy } from '../../services/codex.service';

describe('EnemigosPage', () => {
  let component: EnemigosPage;
  let fixture: ComponentFixture<EnemigosPage>;
  let codexServiceSpy: jasmine.SpyObj<CodexService>;

  beforeEach(async () => {
    codexServiceSpy = jasmine.createSpyObj<CodexService>('CodexService', ['getEnemies']);

    await TestBed.configureTestingModule({
      declarations: [EnemigosPage],
      imports: [CommonModule],
      providers: [{ provide: CodexService, useValue: codexServiceSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    codexServiceSpy.getEnemies.and.returnValue(of([] as Enemy[]));

    fixture = TestBed.createComponent(EnemigosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load enemies on init', () => {
    expect(codexServiceSpy.getEnemies).toHaveBeenCalled();
  });
});
