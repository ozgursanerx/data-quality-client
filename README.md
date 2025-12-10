# 🔍 Flowlytics

Modern, React tabanlı veri akış analizi platformu. Veri ambarı log analizleri, anomali tespiti ve performans izleme özellikleri sunar.

## 🆕 MCP Integration - YENI!

Frontend'den direkt **MCP (Model Context Protocol) Server** çalıştırma özelliği eklendi!

### 🚀 MCP Özellikleri

- **Frontend'den Direkt İstek**: Kullanıcı frontend'den direkt MCP server'ı çalıştırabilir
- **Real-time Analysis**: Canlı veri akış analizi ve geriye dönük izleme
- **Process Management**: Aktif MCP işlemlerini görüntüleme ve yönetme
- **Comprehensive Reports**: Detaylı analiz raporları ve JSON export

### 🛠 MCP Kurulumu

1. **Backend'i başlatın:**
```bash
cd backend
npm install
npm start
```

2. **Frontend'i başlatın:**
```bash
npm install
npm start
```

3. **MCP Analysis sayfasını açın:**
   - Sidebar'dan "MCP Analysis" seçin
   - Schema, table, column bilgilerini girin
   - "Start Analysis" butonuna tıklayın

### 📡 MCP API Endpoints

- `GET /api/health` - Server durumu
- `POST /api/analyze-data-flow` - Veri akış analizi
- `POST /api/analyze-backward-tracing` - Geriye dönük izleme
- `GET /api/schema-packages/{schema}` - Schema paketleri

Detaylı API dokümantasyonu için: [`backend/README.md`](backend/README.md)

---

## 🎯 Ana Özellikler

- **📊 Dashboard**: Sistem genel durumu ve metrikleri
- **🔍 Data Lineage**: İnteraktif veri köken analizi
- **📈 Performance Analytics**: Detaylı performans izleme
- **🚨 Anomaly Detection**: Otomatik anomali tespiti
- **📋 Package Management**: Paket ve prosedür yönetimi
- **🔄 Real-time Monitoring**: Canlı sistem izleme
- **📊 Interactive Visualizations**: D3.js tabanlı görselleştirmeler
- **🎛️ Advanced Filtering**: Çoklu kriter filtreleme

## 📁 Proje Yapısı

```
flowlytics/
├── src/
│   ├── components/         # Ortak bileşenler
│   ├── pages/             # Ana sayfalar
│   │   ├── dashboard/     # Dashboard bileşenleri
│   │   ├── data-lineage/  # Veri köken analizi
│   │   ├── performance/   # Performans analizi
│   │   ├── anomaly/       # Anomali tespiti
│   │   └── packages/      # Paket yönetimi
│   ├── services/          # API servisleri
│   ├── utils/            # Yardımcı fonksiyonlar
│   └── styles/           # CSS stilleri
├── backend/              # MCP Backend Server
├── docs/                 # Dokümantasyon ve örnek veriler
└── public/              # Statik dosyalar
```

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn

### Adımlar

1. **Projeyi klonlayın:**
```bash
git clone https://github.com/flowlytics/flowlytics.git
cd flowlytics
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Geliştirme sunucusunu başlatın:**
```bash
npm start
```

4. **Tarayıcıda açın:**
```
http://localhost:3000
```

## 🛠 Teknolojiler

### Frontend
- **React 19** - Modern UI framework
- **CoreUI 5.x** - Profesyonel admin template
- **D3.js 7.x** - Veri görselleştirme
- **ReactFlow** - İnteraktif akış diyagramları
- **Chart.js** - Grafik ve metrikler
- **React Router 7** - Sayfa yönlendirme
- **Axios** - HTTP istekleri

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MCP Protocol** - Model Context Protocol
- **Winston** - Logging

### Geliştirme
- **Vite** - Build tool
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📊 Özellik Detayları

### Dashboard
- Sistem genel durumu
- Performans metrikleri
- Son aktiviteler
- Hızlı erişim linkleri

### Data Lineage
- İnteraktif veri köken haritası
- Tablo ve kolon bazlı izleme
- Dependency grafiği
- Impact analizi

### Performance Analytics
- Execution time analizi
- Resource usage metrikleri
- Trend analizi
- Bottleneck tespiti

### Anomaly Detection
- Otomatik anomali tespiti
- Threshold bazlı uyarılar
- Pattern recognition
- Alert management

### Package Management
- Paket listesi ve detayları
- Procedure hierarchy
- Step execution tracking
- Error monitoring

## 🔧 Konfigürasyon

### Environment Variables
```bash
# Backend API URL
REACT_APP_API_URL=http://localhost:8080

# MCP Server Configuration
MCP_SERVER_PATH=/path/to/mcp/server
MCP_LOG_LEVEL=info
```

### Build Configuration
```bash
# Production build
npm run build

# Serve production build
npm run serve
```

## 📝 API Dokümantasyonu

### Temel Endpoints
- `GET /api/packages` - Tüm paketleri listele
- `GET /api/packages/:id` - Paket detayları
- `GET /api/procedures/:id` - Prosedür detayları
- `GET /api/analytics/performance` - Performans verileri
- `GET /api/analytics/anomalies` - Anomali verileri

Detaylı API dokümantasyonu için `backend/README.md` dosyasına bakın.

## 🧪 Test

```bash
# Unit testleri çalıştır
npm test

# Test coverage raporu
npm run test:coverage

# E2E testler
npm run test:e2e
```

## 📦 Build

```bash
# Production build
npm run build

# Build analizi
npm run analyze

# Build optimizasyonu kontrolü
npm run build:check
```

## 🚀 Deployment

### Docker ile Deploy
```bash
# Docker image oluştur
docker build -t flowlytics .

# Container çalıştır
docker run -p 3000:3000 flowlytics
```

### Manual Deploy
```bash
# Build al
npm run build

# Build dosyalarını web sunucusuna kopyala
cp -r build/* /var/www/html/
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişiklikleri commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'i push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 🙏 Teşekkürler

- **CoreUI Team** - Harika admin template için
- **D3.js Community** - Güçlü veri görselleştirme kütüphanesi için
- **React Community** - Sürekli gelişen ekosistem için

## 📞 İletişim

- **Proje Sahibi**: Flowlytics Team
- **Email**: contact@flowlytics.com
- **GitHub**: https://github.com/flowlytics/flowlytics

---

⭐ Bu projeyi beğendiyseniz star vermeyi unutmayın!