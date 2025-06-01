import { ModelRouter } from '../ModelRouter';
import { ModelConnector } from '../types';

describe('ModelRouter', () => {
  let router: ModelRouter;
  let availableConnector: ModelConnector;
  let unavailableConnector: ModelConnector;

  beforeEach(() => {
    router = new ModelRouter();
    availableConnector = {
      name: 'available',
      type: 'api',
      isAvailable: jest.fn().mockResolvedValue(true),
      execute: jest.fn(),
    };
    unavailableConnector = {
      name: 'unavailable',
      type: 'api',
      isAvailable: jest.fn().mockResolvedValue(false),
      execute: jest.fn(),
    };
    router.registerConnector(availableConnector);
    router.registerConnector(unavailableConnector);
  });

  it('returns connector if available', async () => {
    const conn = await router.getConnector('available');
    expect(conn).toBe(availableConnector);
  });

  it('returns undefined if connector is unavailable', async () => {
    const conn = await router.getConnector('unavailable');
    expect(conn).toBeUndefined();
  });

  it('returns undefined if connector does not exist', async () => {
    const conn = await router.getConnector('missing');
    expect(conn).toBeUndefined();
  });

  it('falls back to another available connector if primary is unavailable', async () => {
    // Mark 'available' as unavailable, add a new available connector with higher priority
    (availableConnector.isAvailable as jest.Mock).mockResolvedValueOnce(false);
    const fallbackConnector = {
      name: 'fallback',
      type: 'api',
      isAvailable: jest.fn().mockResolvedValue(true),
      execute: jest.fn(),
    };
    router.registerConnector(fallbackConnector, 10); // higher priority
    const conn = await router.getConnector('available');
    expect(conn).toBe(fallbackConnector);
  });
});
