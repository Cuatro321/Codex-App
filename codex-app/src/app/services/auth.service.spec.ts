import { TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let afAuthSpy: jasmine.SpyObj<AngularFireAuth>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AngularFireAuth', [
      'signInWithEmailAndPassword',
      'createUserWithEmailAndPassword',
      'signOut',
    ]);

    (spy as any).authState = of(null);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AngularFireAuth, useValue: spy },
      ],
    });

    service = TestBed.inject(AuthService);
    afAuthSpy = TestBed.inject(
      AngularFireAuth
    ) as jasmine.SpyObj<AngularFireAuth>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('login should call AngularFireAuth', (done) => {
    const mockResult = { user: { uid: '123' } } as any;
    afAuthSpy.signInWithEmailAndPassword.and.returnValue(
      Promise.resolve(mockResult),
    );

    service.login('test@test.com', '123456').subscribe((res) => {
      expect(afAuthSpy.signInWithEmailAndPassword).toHaveBeenCalledWith(
        'test@test.com',
        '123456',
      );
      expect(res).toBe(mockResult);
      done();
    });
  });

  it('register should call AngularFireAuth', (done) => {
    const mockResult = { user: { uid: 'abc' } } as any;
    afAuthSpy.createUserWithEmailAndPassword.and.returnValue(
      Promise.resolve(mockResult),
    );

    service.register('new@test.com', 'abcdef').subscribe((res) => {
      expect(afAuthSpy.createUserWithEmailAndPassword).toHaveBeenCalledWith(
        'new@test.com',
        'abcdef',
      );
      expect(res).toBe(mockResult);
      done();
    });
  });

  it('logout should call AngularFireAuth', (done) => {
    afAuthSpy.signOut.and.returnValue(Promise.resolve());

    service.logout().subscribe(() => {
      expect(afAuthSpy.signOut).toHaveBeenCalled();
      done();
    });
  });
});
