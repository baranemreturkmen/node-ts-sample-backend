import crypto from 'crypto';

describe('Helpers', () => {
  describe('authentication', () => {
    it('should generate consistent SHA256 hash', () => {
      const salt = 'abc123';
      const password = 'myPassword';
      const secret = 'mySecret';

      process.env.SECRET = secret;

      // Jest module cache temizleniyor
      jest.resetModules();

      // helpers dosyasını yeniden yüklüyoruz (import yerine require!)
      const helpers = require('../../src/helpers');

      const expected = crypto
        .createHmac('sha256', [salt, password].join('/'))
        .update(secret)
        .digest('hex');

      const result = helpers.authentication(salt, password);
      expect(result).toBe(expected);
    });
  });
});