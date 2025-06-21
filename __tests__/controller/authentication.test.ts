import { login, register } from '../../src/controllers/authentication';
import * as userDb from '../../src/db/users';
import * as helpers from '../../src/helpers';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

describe('Auth Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let sendStatusMock: jest.Mock;
  let cookieMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    sendStatusMock = jest.fn();
    cookieMock = jest.fn();

    mockRes = {
      status: statusMock,
      sendStatus: sendStatusMock,
      cookie: cookieMock,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create user and return safe user object', async () => {
  const salt = 'salt123';
  const hashedPassword = 'hashed';

  mockReq = {
    body: {
      email: 'test@example.com',
      password: 'mypassword',
      username: 'testuser',
    },
  };

  jest.spyOn(userDb, 'getUserByEmail').mockResolvedValue(null);
  jest.spyOn(helpers, 'random').mockReturnValue(salt);
  jest.spyOn(helpers, 'authentication').mockReturnValue(hashedPassword);

  jest.spyOn(userDb, 'createUser').mockResolvedValue({
    _id: new (require('mongodb').ObjectId)('507f1f77bcf86cd799439011'),
    email: 'test@example.com',
    username: 'testuser',
    authentication: {
      password: hashedPassword,
      salt: salt,
      sessionToken: undefined,
    },
    __v: 0,
  });

  jest.spyOn(helpers, 'toSafeUser').mockReturnValue({
    _id: 'userid123',
    email: 'test@example.com',
    username: 'testuser',
  });

  await register(mockReq as Request, mockRes as Response);

  expect(userDb.getUserByEmail).toHaveBeenCalledWith('test@example.com');
  expect(userDb.createUser).toHaveBeenCalledWith({
    email: 'test@example.com',
    username: 'testuser',
    authentication: {
      salt: 'salt123',
      password: 'hashed', // artık eşleşecek
    },
  });
  expect(mockRes.status).toHaveBeenCalledWith(200);
  expect(jsonMock).toHaveBeenCalledWith({
    _id: 'userid123',
    email: 'test@example.com',
    username: 'testuser',
  });
});

  describe('login', () => {
  it('should authenticate and return user', async () => {
    const salt = 'salt123';
    const hashed = 'hashedPassword'; // authentication fonksiyonu bunu dönecek

    mockReq = {
      body: {
        email: 'test@example.com',
        password: 'mypassword',
      },
      secure: true,
      headers: {},
    };

    const userMock: any = {
      _id: 'userid123',
      email: 'test@example.com',
      username: 'testuser',
      authentication: {
        password: hashed, // burası artık eşleşiyor!
        salt: salt,
        sessionToken: undefined,
      },
      save: jest.fn(),
    };

    jest
      .spyOn(userDb, 'getUserByEmail')
      .mockReturnValue({ select: jest.fn().mockResolvedValue(userMock) } as any);

    jest
      .spyOn(helpers, 'authentication')
      .mockImplementation((s, p) =>
        s === salt && p === 'mypassword' ? hashed : 'wrong'
      );

    jest.spyOn(helpers, 'random').mockReturnValue('newsalt');

    jest
      .spyOn(helpers, 'toSafeUser')
      .mockReturnValue({ _id: 'userid123', email: 'test@example.com', username: 'testuser' });

    await login(mockReq as Request, mockRes as Response);

    expect(userMock.save).toHaveBeenCalled();
    expect(cookieMock).toHaveBeenCalledWith('NODE-TS-AUTH', expect.any(String), expect.any(Object));
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      _id: 'userid123',
      email: 'test@example.com',
      username: 'testuser',
    });
  });
});
});