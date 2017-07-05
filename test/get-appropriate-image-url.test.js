'use strict';

const getAppropriateImageUrl = require('../lib/get-appropriate-image-url');
const isHighResolution = require('../lib/is-high-resolution');
const supportsWebp = require('../lib/supports-webp');

jest.mock('../lib/is-high-resolution', () => {
  return jest.fn().mockReturnValue(false);
});

jest.mock('../lib/supports-webp', () => {
  return jest.fn().mockReturnValue(false);
});

describe('getAppropriateImageUrl', () => {
  const imageConfig = {
    bear: {
      basename: 'bear.png',
      sizes: [{ width: 300 }, { width: 600 }]
    },
    montaraz: {
      basename: 'montaraz.jpg',
      sizes: [
        { width: 300, height: 500 },
        { width: 1200, crop: 'north' },
        { width: 200, height: 200, crop: 'southeast' },
        { width: 210, height: 210, crop: 'northwest' }
      ]
    },
    osprey: {
      basename: 'osprey.jpg',
      sizes: [{ width: 600 }, { width: 300, height: 300 }]
    },
    walrus: {
      basename: 'walrus.png',
      sizes: [{ width: 400 }]
    }
  };

  test('works beneath narrowest', () => {
    expect(
      getAppropriateImageUrl({
        imageId: 'bear',
        availableWidth: 280,
        imageConfig
      })
    ).toBe('bear-300.png');
  });

  test('works between', () => {
    expect(
      getAppropriateImageUrl({
        imageId: 'bear',
        availableWidth: 340,
        imageConfig
      })
    ).toBe('bear-600.png');
  });

  test('works above widest', () => {
    expect(
      getAppropriateImageUrl({
        imageId: 'bear',
        availableWidth: 800,
        imageConfig
      })
    ).toBe('bear-600.png');
  });

  test('reorders sizes as needed', () => {
    expect(
      getAppropriateImageUrl({
        imageId: 'osprey',
        availableWidth: 280,
        imageConfig
      })
    ).toBe('osprey-300x300.jpg');
  });

  test('prepends imageDirectory', () => {
    expect(
      getAppropriateImageUrl({
        imageId: 'osprey',
        availableWidth: 400,
        imageDirectory: 'foo/bar',
        imageConfig
      })
    ).toBe('foo/bar/osprey-600.jpg');

    expect(
      getAppropriateImageUrl({
        imageId: 'osprey',
        availableWidth: 400,
        imageDirectory: 'foo/bar/',
        imageConfig
      })
    ).toBe('foo/bar/osprey-600.jpg');
  });

  test('appends height', () => {
    expect(
      getAppropriateImageUrl({
        imageId: 'montaraz',
        availableWidth: 180,
        imageConfig
      })
    ).toBe('montaraz-200x200.jpg');
  });

  test('appends height', () => {
    expect(
      getAppropriateImageUrl({
        imageId: 'montaraz',
        availableWidth: 180,
        imageConfig
      })
    ).toBe('montaraz-200x200.jpg');
  });

  test('uses webp when supported', () => {
    supportsWebp.mockReturnValueOnce(true);
    expect(
      getAppropriateImageUrl({
        imageId: 'montaraz',
        availableWidth: 180,
        imageConfig
      })
    ).toBe('montaraz-200x200.webp');
  });

  test('accounts for resolution when choosing sizes', () => {
    isHighResolution.mockReturnValueOnce(true);
    expect(
      getAppropriateImageUrl({
        imageId: 'osprey',
        availableWidth: 280,
        imageConfig
      })
    ).toBe('osprey-600.jpg');
  });
});
