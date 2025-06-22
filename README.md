# Node TS Örnek Backend

Bu proje Express.js ve TypeScript kullanılarak oluşturulmuş, MongoDB üzerinde çalışan basit bir kullanıcı yönetim servisidir. Amaç, kayıt ve giriş işlemleri barındıran örnek bir REST API sunmaktır. Proje hem geliştirme ortamında hem de Docker ile konteyner içinde çalıştırılabilir. 

## Kullanılan Başlıca Paketler

- **express** – HTTP sunucusu ve REST uç noktaları için.
- **mongoose** – MongoDB üzerinde nesne modeli oluşturmak için.
- **dotenv** – Ortam değişkenlerini `.env` dosyasından okumak için.
- **body-parser** – Gelen isteklerdeki JSON verilerini ayrıştırmak için.
- **cookie-parser** – Oturum bilgisini çerezlerde tutmak için.
- **compression** – HTTP yanıtlarını sıkıştırmak için.
- **cors** – Cross‑Origin Resource Sharing ayarları için.
- **lodash** – Yardımcı fonksiyonlar ve orta katmanlarda veri işlemek için.
- **nodemon** – Geliştirme sırasında dosya değişikliklerinde uygulamayı yeniden başlatmak için.
- **ts-node** – TypeScript dosyalarını derlemeden çalıştırmak için.
- **jest** ve **ts-jest** – Birim testlerimizi yazmak ve çalıştırmak için.

Bu paketler kullanıcı yönetimi, güvenli kimlik doğrulama ve verimli geliştirme süreci sağlamak amacıyla tercih edildi.

## Kurulum

Projeyi klonladıktan sonra bağımlılıkları yükleyin:

```bash
npm install
```

Uygulamanın çalışabilmesi için kök dizinde bir `.env` dosyası oluşturup aşağıdaki temel değişkenleri tanımlamalısınız:

```bash
MONGO_URL=mongodb://localhost/mydb
SECRET=yourSecretKey
PORT=3000                    # İsteğe bağlı, varsayılan 8080
# HTTPS kullanmak isterseniz:
# HTTPS_KEY=./certs/key.pem
# HTTPS_CERT=./certs/cert.pem
# HTTPS_PORT=8443            # Varsayılan 8443
```

## Çalıştırma

### Node ile

Gerekli paketler yüklendikten sonra uygulamayı doğrudan başlatabilirsiniz:

```bash
npm start      # nodemon ile geliştirme ortamı
# veya
npm run dev    # ts-node ile tek seferlik çalıştırma
```

### Docker ile

Projeyi konteyner içerisinde çalıştırmak için:

```bash
docker-compose up --build
```

Docker kullanmak istemiyorsanız kendi imajınızı da oluşturabilirsiniz:

```bash
docker build -t node-ts-backend .
docker run -p 3000:3000 --env-file .env node-ts-backend
```

## API Uç Noktaları

### Kayıt Olma

`POST /auth/register`

Gönderilen JSON:

```json
{
  "email": "user@example.com",
  "password": "şifre",
  "username": "kullanici"
}
```

Örnek cURL:

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"sifre","username":"kullanici"}'
```

### Giriş Yapma

`POST /auth/login`

Gönderilen JSON:

```json
{
  "email": "user@example.com",
  "password": "şifre"
}
```

Başarılı olduğunda `NODE-TS-AUTH` isimli bir çerez ve kullanıcı bilgileri döner.

Örnek cURL:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"user@example.com","password":"sifre"}'
```

### Kullanıcıları Listeleme

`GET /users`

Oturum açmış kullanıcıya tüm kullanıcıları döner.

```bash
curl http://localhost:3000/users -b cookies.txt
```

### Kullanıcı Güncelleme

`PATCH /users/:id`

Yalnızca oturum açan kendi kullanıcısını güncelleyebilir.

```bash
curl -X PATCH http://localhost:3000/users/<USER_ID> \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"username":"yeni-ad"}'
```

### Kullanıcı Silme

`DELETE /users/:id`

Yalnızca oturum açan kendi kullanıcısını silebilir.

```bash
curl -X DELETE http://localhost:3000/users/<USER_ID> -b cookies.txt
```

## HTTPS Desteği

Uygulama opsiyonel olarak kendi sertifikanızla HTTPS portunda da servis verebilir. Bunun için `.env` dosyanıza `HTTPS_KEY` ve `HTTPS_CERT` değişkenlerini ekleyin. Her iki değişken tanımlandığında uygulama varsayılan olarak 8443 portundan HTTPS'i aktif eder.

Sertifika oluşturmak için `openssl` kullanabilirsiniz:

```bash
mkdir -p certs
openssl req -x509 -nodes -newkey rsa:2048 \
  -keyout certs/key.pem \
  -out certs/cert.pem \
  -days 365
```

Oluşturulan `certs/key.pem` ve `certs/cert.pem` dosyalarının yollarını `.env` dosyanızda ilgili değişkenlere yazmanız yeterlidir.

## Birim Testleri

Tüm birim testleri Jest ile yazılmıştır. Çalıştırmak için:

```bash
npm test
```

## TODO

- Admin kullanıcı rolü eklenerek diğer kullanıcıları silebilme, güncelleme ve kilitleme (banlama) yetkisi verilecek.
- Kilitli kullanıcıların giriş yapamaması sağlanacak.
- Hata yönetimi ve loglama mekanizması iyileştirilebilir.
- Üretim ortamı için daha detaylı güvenlik ayarları eklenebilir.

Bu proje örnek amaçlıdır ve geliştirmeye açıktır.

