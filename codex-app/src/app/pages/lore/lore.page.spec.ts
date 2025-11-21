import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { LorePage } from './lore.page';
import { CodexService, Story, Domain } from '../../services/codex.service';

describe('LorePage', () => {
  let component: LorePage;
  let fixture: ComponentFixture<LorePage>;
  let codexServiceSpy: jasmine.SpyObj<CodexService>;

  beforeEach(async () => {
    codexServiceSpy = jasmine.createSpyObj<CodexService>('CodexService', [
      'getStories',
      'getDomains',
    ]);

    await TestBed.configureTestingModule({
      declarations: [LorePage],
      imports: [CommonModule],
      providers: [{ provide: CodexService, useValue: codexServiceSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    codexServiceSpy.getStories.and.returnValue(of([] as Story[]));
    codexServiceSpy.getDomains.and.returnValue(of([] as Domain[]));

    fixture = TestBed.createComponent(LorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load stories and domains on init', () => {
    expect(codexServiceSpy.getStories).toHaveBeenCalled();
    expect(codexServiceSpy.getDomains).toHaveBeenCalled();
  });
});
