import mongoose from 'mongoose';

import '../models/hospital.model';
import '../models/complaint.model';
import '../models/tags.model';
import '../models/counter.model';
import '../models/twiageCases/twiageCase.model';

const TwiageCase = mongoose.model('TwiageCase');
const Complaint = mongoose.model('Complaint');

describe('twiageCase.model', () => {
  test('.getComplaint - happy path', () => {
    // Arrange
    const expectedComplaint = {
      name: 'STEMI',
      priority: 1,
    };
    const twiageCase = new TwiageCase({
      complaint: new Complaint(expectedComplaint),
    });

    // Act
    const actualComplaint = twiageCase.getComplaint();

    // Assert
    expect(actualComplaint).toEqual(expectedComplaint);
  });

  test('.getComplaint - unknown complaint', () => {
    // Arrange
    const expectedComplaint = { name: 'Unknown', priority: 4 };
    const twiageCase = new TwiageCase();

    // Act
    const actualComplaint = twiageCase.getComplaint();

    // Assert
    expect(actualComplaint).toEqual(expectedComplaint);
  });

  test('.mapMediaToUploads', () => {
    // Assert
    const expectedCreatedAt = '2018-11-28T13:51:46.338Z';
    const expectedFilename = 'photo_1543413106338.jpeg';
    const expectedType = 'photo';
    const expectedMedia = {
      createdAt: expectedCreatedAt,
      filename: expectedFilename,
      type: expectedType,
    };
    const expectedUploads = [
      {
        id: expectedFilename,
        createdAt: expectedCreatedAt,
        type: expectedType,
      },
    ];
    const expectedTwiageCase = {
      media: [expectedMedia],
    };
    const twiageCaseModel = require('../../../../src/db/mongoose/models/twiageCases/twiageCase.model');

    // Act
    const actualUploads = twiageCaseModel.TwiageCaseSchema.methods.mapMediaToUploads.call(expectedTwiageCase);

    // Assert
    expect(actualUploads).toEqual(expectedUploads);
  });

  test('toJSON', () => {
    // Arrange
    const expectedTwiageCaseId = '5bfe9cb9531c7f001e69c1c0';
    const expectedMedia = {};
    const expectedInitialUploads = ['initial uploads'];
    const expectedUploads = ['uploads after transformation'];
    const expectedToObject = () => expectedInitialTwiageCase;
    const mockMapMediaFunction = jest.fn(() => expectedUploads);
    const expectedInitialTwiageCase = {
      id: expectedTwiageCaseId,
      media: expectedMedia,
      uploads: expectedInitialUploads,
      toObject: expectedToObject,
      mapMediaToUploads: mockMapMediaFunction,
    };
    const expectedTwiageCase = {
      id: expectedTwiageCaseId,
      uploads: expectedUploads,
      toObject: expectedToObject,
      mapMediaToUploads: mockMapMediaFunction,
    };
    const twiageCaseModel = require('../../../../src/db/mongoose/models/twiageCases/twiageCase.model');
    twiageCaseModel.TwiageCaseSchema.methods.mapMediaToUploads = () => expectedUploads;

    // Act
    const actualTwiageCase = twiageCaseModel.TwiageCaseSchema.methods.toJSON.call(expectedInitialTwiageCase);

    // Assert
    expect(actualTwiageCase).toEqual(expectedTwiageCase);
    expect(mockMapMediaFunction).toHaveBeenCalled();
  });

  test('virtual("uploads")', () => {
    // Arrange
    const expectedFilename = 'photo_timestamp.jpeg';
    const expectedCreatedAt = 'some date';
    const expectedCreatedBy = undefined;
    const expectedType = 'photo';
    const expectedMedia = {
      filename: expectedFilename,
      createdAt: expectedCreatedAt,
      type: expectedType,
    };
    const expectedUploads = [{
      id: expectedFilename,
      createdAt: expectedCreatedAt,
      createdBy: expectedCreatedBy,
      type: expectedType,
    }];

    // Act
    const twiageCase = new TwiageCase({
      createdBy: expectedCreatedBy,
      media: [expectedMedia],
    });

    // Assert
    expect(twiageCase.uploads).toEqual(expectedUploads);
  });
});
