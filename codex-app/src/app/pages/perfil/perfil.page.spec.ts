import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import firebase from 'firebase/compat/app';

import { PerfilPage } from './perfil.page';
import { AuthService } from '../../services/auth.service';

describe('PerfilPage', () => {
  let component: PerfilPage;
  let fixture: ComponentFixture<PerfilPage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj<AuthService>(
      'AuthService',
      ['login', 'register', 'logout']
    );

    // observable que usa el componente
    (authServiceSpy as any).user$ = of(null as firebase.User | null);

    await TestBed.configureTestingModule({
      declarations: [PerfilPage],
      imports: [CommonModule, FormsModule],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilPage);
    component = fixture.componentInstance;
    // OJO: NO llamamos a fixture.detectChanges() para no inicializar el template con ngModel
  });

  it('should create and start in login mode', () => {
    expect(component).toBeTruthy();
    expect(component.mode).toBe('login');
  });

  it('should toggle mode and clear error', () => {
    component.errorMessage = 'algo';
    component.toggleMode('register');
    expect(component.mode).toBe('register');
    expect(component.errorMessage).toBe('');
  });

  it('should call login on submit when in login mode', () => {
    component.mode = 'login';
    component.email = 'test@test.com';
    component.password = '123456';

    authServiceSpy.login.and.returnValue(of({}));

    component.submit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('test@test.com', '123456');
    expect(component.loading).toBeFalse();
    expect(component.email).toBe('');
    expect(component.password).toBe('');
  });

  it('should call register on submit when in register mode', () => {
    component.toggleMode('register');
    component.email = 'new@test.com';
    component.password = 'abcdef';

    authServiceSpy.register.and.returnValue(of({}));

    component.submit();

    expect(authServiceSpy.register).toHaveBeenCalledWith('new@test.com', 'abcdef');
    expect(component.loading).toBeFalse();
  });

  it('should handle error on submit', () => {
    component.mode = 'login';
    component.email = 'err@test.com';
    component.password = 'pass';

    authServiceSpy.login.and.returnValue(
      throwError(() => ({ message: 'Error de prueba' }))
    );

    component.submit();

    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe('Error de prueba');
  });

  it('should logout', () => {
    authServiceSpy.logout.and.returnValue(of(void 0));

    component.logout();

    expect(authServiceSpy.logout).toHaveBeenCalled();
  });
});
