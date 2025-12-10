# 🚀 Deployment Guide

Bu doküman, EDW Flowlytics frontend uygulamasının production'a deploy edilmesi için gerekli adımları içerir.

## 📋 Ön Gereksinimler

- Node.js 18+ yüklü olmalı
- Backend API sunucusu deploy edilmiş ve çalışıyor olmalı
- Web sunucusu (Nginx, Apache, IIS vb.) yapılandırılmış olmalı

## 🔧 1. Environment Variables Ayarlama

### `.env.production` Dosyası Oluşturma

Proje root dizininde `.env.production` dosyası oluşturun:

```bash
# Production Environment Variables

# Backend API Base URL (sonunda / olmamalı)
# Örnek: https://api.yourcompany.com
# Örnek: https://backend.yourcompany.com:8080
VITE_API_BASE_URL=https://your-backend-server.com

# Application Name (opsiyonel)
VITE_APP_NAME=EDW Flowlytics
```

**Önemli:** 
- `.env.production` dosyası `.gitignore`'da olduğu için git'e commit edilmeyecek
- Her environment için farklı URL kullanın
- URL'in sonunda `/` olmamalı

## 🏗️ 2. Production Build

### Build Komutu

```bash
# Production build al
npm run build:prod

# Veya standart build
npm run build
```

Build işlemi sonrası `build/` klasörü oluşacak.

### Build Kontrolü

```bash
# Build klasörünü kontrol et
ls -la build/

# Klasör yapısı şöyle olmalı:
# build/
#   ├── index.html
#   ├── assets/
#   │   ├── index-[hash].js
#   │   ├── index-[hash].css
#   │   └── ...
#   └── favicon.ico
```

## 📦 3. Deployment Seçenekleri

### Seçenek A: Nginx ile Deploy

#### Nginx Konfigürasyonu

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/flowlytics/build;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # SPA için tüm route'ları index.html'e yönlendir
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (eğer backend aynı domain'de değilse)
    location /edwapi {
        proxy_pass https://your-backend-server.com/edwapi;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers (eğer backend'de yoksa)
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
        add_header Access-Control-Allow-Headers 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
    }

    # Static assets cache (1 yıl)
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # HTML dosyaları cache'lenmemeli
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }
}
```

#### Deployment Adımları

```bash
# 1. Build klasörünü sunucuya kopyala
scp -r build/* user@server:/var/www/flowlytics/build/

# 2. Nginx'i yeniden yükle
sudo nginx -t
sudo systemctl reload nginx
```

### Seçenek B: Apache ile Deploy

#### Apache `.htaccess` Dosyası

`build/.htaccess` dosyası oluşturun:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType application/x-javascript "access plus 1 year"
</IfModule>
```

### Seçenek C: IIS ile Deploy (Windows)

#### `web.config` Dosyası

`build/web.config` dosyası oluşturun:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/index.html" />
        </rule>
      </rules>
    </rewrite>
    <staticContent>
      <clientCache cacheControlMode="UseMaxAge" cacheControlMaxAge="365.00:00:00" />
    </staticContent>
  </system.webServer>
</configuration>
```

## 🔒 4. HTTPS Yapılandırması

Production'da mutlaka HTTPS kullanın:

```nginx
# Nginx HTTPS örneği
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # ... diğer konfigürasyonlar
}

# HTTP'den HTTPS'e yönlendirme
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

## ✅ 5. Deployment Checklist

- [ ] `.env.production` dosyası oluşturuldu ve backend URL'i ayarlandı
- [ ] `npm run build:prod` komutu başarıyla çalıştı
- [ ] `build/` klasörü oluştu ve içeriği kontrol edildi
- [ ] Web sunucusu konfigürasyonu yapıldı
- [ ] SPA routing için rewrite rules eklendi
- [ ] Static assets cache ayarları yapıldı
- [ ] HTTPS yapılandırıldı
- [ ] Backend CORS ayarları kontrol edildi
- [ ] API endpoint'leri test edildi
- [ ] Production URL'de test yapıldı

## 🧪 6. Test

### Local Build Test

```bash
# Build al
npm run build:prod

# Local'de test et
npm run serve

# Tarayıcıda aç: http://localhost:4173
```

### Production Test

1. Tüm sayfaların yüklendiğini kontrol edin
2. API çağrılarının çalıştığını kontrol edin
3. Browser console'da hata olmadığını kontrol edin
4. Network tab'da API isteklerinin doğru URL'e gittiğini kontrol edin

## 🐛 7. Sorun Giderme

### API İstekleri Çalışmıyor

- `.env.production` dosyasında `VITE_API_BASE_URL` doğru mu?
- Backend CORS ayarları frontend domain'ine izin veriyor mu?
- Browser console'da CORS hatası var mı?

### Sayfa Yenilendiğinde 404 Hatası

- Web sunucusu rewrite rules doğru yapılandırılmış mı?
- Tüm route'lar `index.html`'e yönlendiriliyor mu?

### Build Boyutu Çok Büyük

- `npm run build:prod` kullanıldı mı?
- `vite.config.mjs`'deki `manualChunks` ayarları çalışıyor mu?
- Gereksiz dependencies var mı?

## 📝 8. Notlar

- **Environment Variables**: Vite'da environment variable'lar `VITE_` prefix'i ile başlamalı
- **Build Optimization**: Production build'de sourcemap kapalı, minify açık
- **Code Splitting**: Vendor kodları ayrı chunk'lara bölündü (daha hızlı yükleme)
- **Cache Strategy**: Static assets 1 yıl cache'lenir, HTML dosyaları cache'lenmez

## 🔄 9. Güncelleme Süreci

```bash
# 1. Yeni kodları çek
git pull origin main

# 2. Dependencies güncelle (gerekirse)
npm install

# 3. Build al
npm run build:prod

# 4. Build klasörünü deploy et
# (Nginx/Apache/IIS'e kopyala)

# 5. Web sunucusunu yeniden yükle
```

## 📞 Destek

Sorun yaşarsanız:
1. Browser console'u kontrol edin
2. Network tab'da API isteklerini kontrol edin
3. Web sunucusu loglarını kontrol edin
4. Backend API loglarını kontrol edin

