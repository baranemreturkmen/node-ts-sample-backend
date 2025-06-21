import { getAllUsers, deleteUser, updateUser } from '../../src/controllers/users';
import * as userDb from '../../src/db/users';
import * as helpers from '../../src/helpers';
import { Request, Response } from 'express';

describe('User Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let sendStatusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    sendStatusMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockRes = {
      status: statusMock,
      json: jsonMock,
      sendStatus: sendStatusMock,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return safe user list', async () => {
      const users = [{ _id: '1', username: 'a' }, { _id: '2', username: 'b' }];
      jest.spyOn(userDb, 'getUsers').mockResolvedValue(users as any);
      jest.spyOn(helpers, 'toSafeUser').mockImplementation((u) => u); // no transform for simplicity

      await getAllUsers({} as Request, mockRes as Response);

      expect(userDb.getUsers).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(users);
    });

    it('should return 400 on error', async () => {
      jest.spyOn(userDb, 'getUsers').mockRejectedValue(new Error('DB Error'));
      await getAllUsers({} as Request, mockRes as Response);
      expect(mockRes.sendStatus).toHaveBeenCalledWith(400);
    });
  });

  describe('deleteUser', () => {
    it('should return deleted user as safeUser', async () => {
      const deleted = { _id: '123', username: 'deletedUser' };
      mockReq = { params: { id: '123' } };
      jest.spyOn(userDb, 'deleteUserById').mockResolvedValue(deleted as any);
      jest.spyOn(helpers, 'toSafeUser').mockReturnValue(deleted as any);

      await deleteUser(mockReq as Request, mockRes as Response);

      expect(userDb.deleteUserById).toHaveBeenCalledWith('123');
      expect(mockRes.json).toHaveBeenCalledWith(deleted);
    });

    it('should return 400 if user not found', async () => {
      mockReq = { params: { id: '123' } };
      jest.spyOn(userDb, 'deleteUserById').mockResolvedValue(null);

      await deleteUser(mockReq as Request, mockRes as Response);
      expect(mockRes.sendStatus).toHaveBeenCalledWith(400);
    });

    it('should return 400 on error', async () => {
      mockReq = { params: { id: '123' } };
      jest.spyOn(userDb, 'deleteUserById').mockRejectedValue(new Error('fail'));
      await deleteUser(mockReq as Request, mockRes as Response);
      expect(mockRes.sendStatus).toHaveBeenCalledWith(400);
    });
  });

  describe('updateUser', () => {
    it('should update and return safe user', async () => {
      const user = { _id: '1', username: 'old' };
      const updated = { _id: '1', username: 'new' };
      mockReq = {
        params: { id: '1' },
        body: { username: 'new' },
      };

      jest.spyOn(userDb, 'getUserById').mockResolvedValue(user as any);
      jest.spyOn(userDb, 'updateUserById').mockResolvedValue(updated as any);
      jest.spyOn(helpers, 'toSafeUser').mockReturnValue(updated as any);

      await updateUser(mockReq as Request, mockRes as Response);

      expect(userDb.getUserById).toHaveBeenCalledWith('1');
      expect(userDb.updateUserById).toHaveBeenCalledWith('1', { username: 'new' });
      expect(mockRes.json).toHaveBeenCalledWith(updated);
    });

    it('should return 400 if username is invalid', async () => {
      mockReq = {
        params: { id: '1' },
        body: { username: 123 }, // not a string
      };
      await updateUser(mockReq as Request, mockRes as Response);
      expect(mockRes.sendStatus).toHaveBeenCalledWith(400);
    });

    it('should return 400 if user not found', async () => {
      mockReq = {
        params: { id: '1' },
        body: { username: 'new' },
      };
      jest.spyOn(userDb, 'getUserById').mockResolvedValue(null);

      await updateUser(mockReq as Request, mockRes as Response);
      expect(mockRes.sendStatus).toHaveBeenCalledWith(400);
    });

    it('should return 400 if update fails', async () => {
      const user = { _id: '1', username: 'old' };
      mockReq = {
        params: { id: '1' },
        body: { username: 'new' },
      };

      jest.spyOn(userDb, 'getUserById').mockResolvedValue(user as any);
      jest.spyOn(userDb, 'updateUserById').mockResolvedValue(null);

      await updateUser(mockReq as Request, mockRes as Response);
      expect(mockRes.sendStatus).toHaveBeenCalledWith(400);
    });

    it('should return 400 on error', async () => {
      mockReq = {
        params: { id: '1' },
        body: { username: 'new' },
      };
      jest.spyOn(userDb, 'getUserById').mockRejectedValue(new Error('fail'));

      await updateUser(mockReq as Request, mockRes as Response);
      expect(mockRes.sendStatus).toHaveBeenCalledWith(400);
    });
  });
});