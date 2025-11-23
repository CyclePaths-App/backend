import * as turf from '@turf/turf';

//#region Setup

beforeAll(async () => {
  // Initial setup once before any tests run
});

beforeEach(async () => {
  // Setup before each test.
});

afterEach(() => {
  // Cleanup after each individual test
});

afterAll(() => {
  // Final cleanup once after all tests run
});

//#endregion

test('Should use the correct distance formula', () => {
  const line = turf.lineString([
    [12.590932, 55.674221],
    [12.594269, 55.672387],
  ]);

  const length = turf.length(line, { units: 'meters' });

  expect(length).toBeCloseTo(292.2, 1);
});
