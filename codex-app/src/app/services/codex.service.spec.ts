import { of } from 'rxjs';

import { CodexService } from './codex.service';

describe('CodexService', () => {
  // Crea una instancia real pero sustituyendo collection$ por un spy
  function createServiceWithStub() {
    const service = new CodexService();

    const collectionSpy = jasmine
      .createSpy('collection$')
      .and.returnValue(of([{ id: '1', name: 'Item 1' }] as any[]));

    // Sobrescribimos el método privado en la instancia
    (service as any).collection$ = collectionSpy;

    return { service, collectionSpy };
  }

  it('should be created', () => {
    const service = new CodexService();
    expect(service).toBeTruthy();
  });

  it('getCharacters should use collection$', (done) => {
    const { service, collectionSpy } = createServiceWithStub();

    service.getCharacters().subscribe((items) => {
      expect(items.length).toBe(1);
      expect(collectionSpy).toHaveBeenCalledWith('characters', 'name');
      done();
    });
  });

  it('getEmblems should use collection$', (done) => {
    const { service, collectionSpy } = createServiceWithStub();

    service.getEmblems().subscribe((items) => {
      expect(items.length).toBe(1);
      expect(collectionSpy).toHaveBeenCalledWith('emblems', 'name');
      done();
    });
  });

  it('getAssets should use collection$', (done) => {
    const { service, collectionSpy } = createServiceWithStub();

    service.getAssets().subscribe((items) => {
      expect(items.length).toBe(1);
      // AQUÍ LA CORRECCIÓN: el servicio ordena por "id"
      expect(collectionSpy).toHaveBeenCalledWith('assets', 'id');
      done();
    });
  });

  it('getDomains should use collection$', (done) => {
    const { service, collectionSpy } = createServiceWithStub();

    service.getDomains().subscribe((items) => {
      expect(items.length).toBe(1);
      // AQUÍ LA CORRECCIÓN: el servicio ordena por "order"
      expect(collectionSpy).toHaveBeenCalledWith('domains', 'order');
      done();
    });
  });

  it('getEnemies should use collection$', (done) => {
    const { service, collectionSpy } = createServiceWithStub();

    service.getEnemies().subscribe((items) => {
      expect(items.length).toBe(1);
      expect(collectionSpy).toHaveBeenCalledWith('enemies', 'name');
      done();
    });
  });

  it('getGuides should use collection$', (done) => {
    const { service, collectionSpy } = createServiceWithStub();

    service.getGuides().subscribe((items) => {
      expect(items.length).toBe(1);
      expect(collectionSpy).toHaveBeenCalledWith('guides', 'title');
      done();
    });
  });

  it('getStories should use collection$', (done) => {
    const { service, collectionSpy } = createServiceWithStub();

    service.getStories().subscribe((items) => {
      expect(items.length).toBe(1);
      expect(collectionSpy).toHaveBeenCalledWith('stories', 'title');
      done();
    });
  });

  it('getTraps should use collection$', (done) => {
    const { service, collectionSpy } = createServiceWithStub();

    service.getTraps().subscribe((items) => {
      expect(items.length).toBe(1);
      expect(collectionSpy).toHaveBeenCalledWith('traps', 'title');
      done();
    });
  });
});
