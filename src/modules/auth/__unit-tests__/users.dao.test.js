describe('mongo.users.controller', () => {
  test('get user by email', async () => {
    const expectedEmail = 'doPdodlefA@twiagemed.com';
    const expectedEmailQuery = { email: expectedEmail.toLowerCase() };
    const expectedUser = { email: expectedEmail };

    const mockDb = { findOne: jest.fn(() => expectedUser) };
    const mockGetDb = { model: () => mockDb };

    jest.mock('mongoose', () => mockGetDb);
    const controller = require('../users.dao');

    // Act
    const actualUser = await controller.getUserByEmail(expectedEmail);

    // Assert
    expect(actualUser).toEqual(expectedUser);
    expect(mockDb.findOne).toBeCalledWith(expectedEmailQuery);
  });
});
