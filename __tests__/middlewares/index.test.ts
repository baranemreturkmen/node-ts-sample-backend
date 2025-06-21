import { isAuthenticated, isOwner } from '../../src/middlewares/index';
import * as userDb from '../../src/db/users';
import { Request, Response, NextFunction } from 'express';

describe('Auth Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let nextMock: jest.Mock;

  let sendStatusMock: jest.Mock;

  beforeEach(() => {
    nextMock = jest.fn();
    sendStatusMock = jest.fn();
    mockRes = {
      sendStatus: sendStatusMock,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isAuthenticated', () => {
    it('should call next if user is authenticated', async () => {
      const mockUser = { _id: '123', email: 'test@example.com' };

      mockReq = {
        cookies: { 'NODE-TS-AUTH': 'validtoken' },
      };

      jest
        .spyOn(userDb, 'getUserBySessionToken')
        .mockResolvedValue(mockUser as any);

      await isAuthenticated(mockReq as Request, mockRes as Response, nextMock as NextFunction);

      expect(userDb.getUserBySessionToken).toHaveBeenCalledWith('validtoken');
      expect(mockReq).toHaveProperty('identity', mockUser); // merge işlemi
      expect(nextMock).toHaveBeenCalled();
    });

    it('should return 403 if no token in cookie', async () => {
      mockReq = {
        cookies: {}, // no token
      };

      await isAuthenticated(mockReq as Request, mockRes as Response, nextMock as NextFunction);

      expect(sendStatusMock).toHaveBeenCalledWith(403);
      expect(nextMock).not.toHaveBeenCalled();
    });

    it('should return 403 if user not found', async () => {
      mockReq = {
        cookies: { 'NODE-TS-AUTH': 'invalidtoken' },
      };

      jest
        .spyOn(userDb, 'getUserBySessionToken')
        .mockResolvedValue(null);

      await isAuthenticated(mockReq as Request, mockRes as Response, nextMock as NextFunction);

      expect(sendStatusMock).toHaveBeenCalledWith(403);
      expect(nextMock).not.toHaveBeenCalled();
    });

    it('should return 400 on exception', async () => {
      mockReq = {
        cookies: { 'NODE-TS-AUTH': 'crashtoken' },
      };

      jest
        .spyOn(userDb, 'getUserBySessionToken')
        .mockRejectedValue(new Error('DB error'));

      await isAuthenticated(mockReq as Request, mockRes as Response, nextMock as NextFunction);

      expect(sendStatusMock).toHaveBeenCalledWith(400);
      expect(nextMock).not.toHaveBeenCalled();
    });
  });

  describe('isOwner', () => {
    it('should call next if id matches current user', async () => {
      mockReq = {
        params: { id: '123' },
        // @ts-expect-error: identity is a custom property for testing
        identity: { _id: '123' },
      };

      await isOwner(mockReq as Request, mockRes as Response, nextMock as NextFunction);

      expect(nextMock).toHaveBeenCalled();
    });

    it('should return 403 if identity is missing', async () => {
      mockReq = {
        params: { id: '123' },
        identity: undefined, // identity yok
      } as Partial<Request> & { identity?: any };

      await isOwner(mockReq as Request, mockRes as Response, nextMock as NextFunction);

      expect(sendStatusMock).toHaveBeenCalledWith(403);
      expect(nextMock).not.toHaveBeenCalled();
    });

    it('should return 403 if id does not match', async () => {
      mockReq = {
        params: { id: 'abc' },
        identity: { _id: 'xyz' },
      } as Partial<Request> & { identity?: any };

      await isOwner(mockReq as Request, mockRes as Response, nextMock as NextFunction);

      expect(sendStatusMock).toHaveBeenCalledWith(403);
      expect(nextMock).not.toHaveBeenCalled();
    });

    it('should return 400 on exception', async () => {
      // Provide a minimal mockReq with cookies to satisfy type requirements, but force an error inside isOwner
      mockReq = { cookies: {} } as any;
      // Optionally, you can still force an error by passing an invalid structure if needed for your test logic

      await isOwner(mockReq as Request, mockRes as Response, nextMock as NextFunction);

      expect(sendStatusMock).toHaveBeenCalledWith(400);
      expect(nextMock).not.toHaveBeenCalled();
    });
  });
});