import * as userDb from '../../src/db/users'; // tüm fonksiyonları burada yakalayacağız
import mongoose from 'mongoose';

describe('User DB Functions', () => {
  const mockUser = {
    _id: new mongoose.Types.ObjectId(),
    username: 'testuser',
    email: 'test@example.com',
    authentication: {
      password: 'hashed',
      salt: 'salt',
      sessionToken: 'token',
    },
    toObject: () => ({
      username: 'testuser',
      email: 'test@example.com',
    }),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('createUser should save and return user object', async () => {
    const saveMock = jest.fn().mockResolvedValue(mockUser);
    const userModelMock = jest.fn(() => ({ save: saveMock }));
    jest.spyOn(userDb, 'UserModel').mockImplementation(userModelMock as any);

    const result = await userDb.createUser({
      username: 'testuser',
      email: 'test@example.com',
    });

    expect(result).toEqual({
      username: 'testuser',
      email: 'test@example.com',
    });
  });

  it('getUserByEmail should call findOne with email', async () => {
    const findOneMock = jest.fn().mockResolvedValue(mockUser);
    (userDb.UserModel as any).findOne = findOneMock;

    const result = await userDb.getUserByEmail('test@example.com');

    expect(findOneMock).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(result).toBe(mockUser);
  });

  it('getUserById should call findById with id', async () => {
    const findByIdMock = jest.fn().mockResolvedValue(mockUser);
    (userDb.UserModel as any).findById = findByIdMock;

    const result = await userDb.getUserById('507f191e810c19729de860ea');

    expect(findByIdMock).toHaveBeenCalledWith('507f191e810c19729de860ea');
    expect(result).toBe(mockUser);
  });

  it('updateUserById should update and return user object', async () => {
    const saveMock = jest.fn().mockResolvedValue(mockUser);
    const findByIdMock = jest
      .spyOn(userDb.UserModel, 'findById')
      .mockResolvedValue({ ...mockUser, save: saveMock } as any);

    const result = await userDb.updateUserById('507f191e810c19729de860ea', {
      username: 'updated',
    });

    expect(findByIdMock).toHaveBeenCalledWith('507f191e810c19729de860ea');
    expect(result).toEqual({
      username: 'testuser',
      email: 'test@example.com',
    });
  });

  it('deleteUserById should call findOneAndDelete with id', async () => {
    const findOneAndDeleteMock = jest.fn().mockResolvedValue(mockUser);
    (userDb.UserModel as any).findOneAndDelete = findOneAndDeleteMock;

    const result = await userDb.deleteUserById('507f191e810c19729de860ea');

    expect(findOneAndDeleteMock).toHaveBeenCalledWith({
      _id: '507f191e810c19729de860ea',
    });
    expect(result).toBe(mockUser);
  });
});