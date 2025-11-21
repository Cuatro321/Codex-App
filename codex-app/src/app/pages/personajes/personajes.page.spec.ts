import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { PersonajesPage } from './personajes.page';
import { CodexService, Character } from '../../services/codex.service';

describe('PersonajesPage', () => {
  let component: PersonajesPage;
  let fixture: ComponentFixture<PersonajesPage>;
  let codexServiceSpy: jasmine.SpyObj<CodexService>;

  beforeEach(async () => {
    codexServiceSpy = jasmine.createSpyObj<CodexService>('CodexService', ['getCharacters']);

    await TestBed.configureTestingModule({
      declarations: [PersonajesPage],
      imports: [CommonModule],
      providers: [{ provide: CodexService, useValue: codexServiceSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    codexServiceSpy.getCharacters.and.returnValue(of([] as Character[]));

    fixture = TestBed.createComponent(PersonajesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load characters on init', () => {
    expect(codexServiceSpy.getCharacters).toHaveBeenCalled();
  });
});
