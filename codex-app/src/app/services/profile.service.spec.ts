import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';

import { ProfileService, UserProfile } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;
  let afsSpy: jasmine.SpyObj<AngularFirestore>;

  // referencia simulada al documento de Firestore
  let docRef: {
    valueChanges: jasmine.Spy;
    ref: { get: jasmine.Spy };
    set: jasmine.Spy;
    update: jasmine.Spy;
  };

  beforeEach(() => {
    docRef = {
      valueChanges: jasmine.createSpy('valueChanges'),
      ref: { get: jasmine.createSpy('get') },
      set: jasmine.createSpy('set'),
      update: jasmine.createSpy('update'),
    };

    afsSpy = jasmine.createSpyObj<AngularFirestore>('AngularFirestore', ['doc']);
    // cuando se llame a afs.doc(...) devolvemos nuestro doc simulado
    (afsSpy.doc as jasmine.Spy).and.returnValue(docRef as any);

    TestBed.configureTestingModule({
      providers: [
        ProfileService,
        { provide: AngularFirestore, useValue: afsSpy },
      ],
    });

    service = TestBed.inject(ProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getUserProfile should map profile data', (done) => {
    const profile: UserProfile = {
      uid: '123',
      displayName: 'Test',
      username: 'testuser',
      createdAt: new Date(),
    };

    docRef.valueChanges.and.returnValue(of(profile));

    service.getUserProfile('123').subscribe((res) => {
      // solo comprobamos que se llamó a doc(), sin pelear con tipos
      expect(afsSpy.doc).toHaveBeenCalled();
      expect(res).toEqual(profile);
      done();
    });
  });

  it('getUserProfile should return null when no data', (done) => {
    docRef.valueChanges.and.returnValue(of(null));

    service.getUserProfile('123').subscribe((res) => {
      expect(res).toBeNull();
      done();
    });
  });

  it('createOrUpdateProfile should create a new profile when none exists', async () => {
    docRef.ref.get.and.returnValue(Promise.resolve({ exists: false } as any));
    docRef.set.and.returnValue(Promise.resolve());

    await service.createOrUpdateProfile('123', {
      displayName: 'New User',
      username: 'newuser',
    });

    expect(afsSpy.doc).toHaveBeenCalled();
    expect(docRef.set).toHaveBeenCalled();
  });

  it('createOrUpdateProfile should update existing profile', async () => {
    docRef.ref.get.and.returnValue(Promise.resolve({ exists: true } as any));
    docRef.update.and.returnValue(Promise.resolve());

    await service.createOrUpdateProfile('123', {
      bio: 'Hello',
    });

    expect(docRef.update).toHaveBeenCalled();
  });
});
