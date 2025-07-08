# Gelişmiş Anomali Tespit Sistemi

## 🎯 Genel Bakış

Bu sistem, EDW_PROC_LOG tablosundaki işlem sürelerini analiz ederek anomalileri tespit eder. Sistem, çoklu istatistiksel yöntem kullanarak hem izole anomalileri hem de genel sistem yavaşlıklarını tespit edebilir.

## 🏗️ Sistem Mimarisi

### Frontend Bileşenleri
- **ProcLogTable.js**: Ana anomali analiz arayüzü
- **CustomTable.js**: Sonuçları görüntüleyen tablo bileşeni
- **LoadingButton.js**: Analiz başlatma butonu

### Backend Entegrasyonu
- **API Endpoint**: `/edwapi/getEnhancedEdwProcLogAnomalyService`
- **SQL Query**: `ENHANCED_ANOMALY_DETECTION_QUERY`

## 📊 Anomali Tespit Yöntemleri

### 1. Z-Score Yöntemi
```sql
Z = |x - μ| / σ
```
- **Açıklama**: Standart sapma tabanlı anomali tespiti
- **Eşik**: 2.0 (önerilen)
- **Kullanım**: Genel anomali tespiti için

### 2. IQR (Interquartile Range) Yöntemi
```sql
Outlier = x < Q1 - 1.5*IQR veya x > Q3 + 1.5*IQR
```
- **Açıklama**: Çeyreklik değerler arası mesafe
- **Avantaj**: Outlier'lara karşı dayanıklı
- **Çarpan**: 1.5 (önerilen)

### 3. Percentile Yöntemi
```sql
Anomaly = Duration > P95 * threshold
```
- **Açıklama**: 95. percentile tabanlı
- **Eşik**: 1.2 (önerilen)
- **Kullanım**: Yüksek performans sapmaları için

### 4. Modified Z-Score
```sql
Modified Z = |x - median| / (1.4826 * MAD)
```
- **Açıklama**: Median tabanlı robust yöntem
- **Eşik**: 3.5 (önerilen)
- **Avantaj**: Extreme değerlere karşı dayanıklı

## 🔧 Parametre Konfigürasyonu

### Temel Parametreler

| Parametre | Açıklama | Örnek Değer |
|-----------|----------|-------------|
| **Prog ID** | Program kimlik numarası | 12345 |
| **Gruplama Türü** | STEP/PROCEDURE/PACKAGE | STEP |
| **Analiz Periyodu** | DAILY/WEEKLY/MONTHLY/CUSTOM | DAILY |
| **Geçmiş Veri (Gün)** | İstatistik hesabı için | 365 |
| **Analiz Başlangıç** | Analiz edilecek dönem başı | 2024-12-01 |
| **Analiz Bitiş** | Analiz edilecek dönem sonu | 2024-12-07 |

### Gelişmiş İstatistik Parametreleri

| Parametre | Açıklama | Önerilen Değer |
|-----------|----------|----------------|
| **Z-Score Eşiği** | Z-Score anomali tespiti | 2.0 |
| **IQR Çarpanı** | IQR anomali çarpanı | 1.5 |
| **Global Anomali %** | Genel yavaşlık oranı | 75.0 |
| **Min. Çalışma Sayısı** | Minimum execution | 5 |
| **Gösterim Modu** | ANOMALY_ONLY/ALL | ANOMALY_ONLY |

## 📈 Anomali Sınıflandırması

### Önem Dereceleri

| Seviye | Z-Score Aralığı | Açıklama | Aksiyon |
|--------|----------------|----------|---------|
| **NORMAL** | < 2.0 | Normal performans | İzleme |
| **MODERATE** | 2.0 - 3.0 | Orta seviye sapma | Trend takibi |
| **HIGH** | 3.0 - 4.0 | Yüksek seviye sapma | İnceleme gerekli |
| **EXTREME** | > 4.0 | Kritik seviye sapma | Acil müdahale |

### Dönem Tipleri

| Tip | Açıklama | Örnek Senaryo |
|-----|----------|---------------|
| **NORMAL_PERIOD** | Normal çalışma | Tüm işlemler normal |
| **ISOLATED_ANOMALY** | İzole anomali | Sadece 1 step yavaş |
| **PARTIAL_ANOMALY** | Kısmi anomali | Birkaç step etkilenmiş |
| **GLOBAL_SLOWDOWN** | Genel yavaşlık | Sistem geneli yavaş |

## 🎨 Kullanıcı Arayüzü

### Renk Kodlaması

#### Önem Derecesi Renkleri
- 🔴 **EXTREME**: Kırmızı (#dc3545)
- 🟠 **HIGH**: Turuncu (#fd7e14)
- 🟡 **MODERATE**: Sarı (#ffc107)
- 🟢 **NORMAL**: Yeşil (#28a745)

#### Dönem Tipi Renkleri
- 🔴 **GLOBAL_SLOWDOWN**: Kırmızı
- 🟠 **PARTIAL_ANOMALY**: Turuncu
- 🟡 **ISOLATED_ANOMALY**: Sarı
- 🟢 **NORMAL_PERIOD**: Yeşil

### Alert Mesajları
- ✅ **Başarı**: "Sistem normal çalışıyor, anomali tespit edilmedi."
- ⚠️ **Uyarı**: "X adet anomali tespit edildi."
- 🚨 **Tehlike**: "Genel sistem yavaşlığı tespit edildi!"
- ℹ️ **Bilgi**: "Belirtilen kriterlere uygun anomali bulunamadı."

## 🔍 Kullanım Senaryoları

### Senaryo 1: Günlük Step Bazında Analiz
```javascript
const params = {
  progId: 12345,
  groupType: 'STEP',
  analysisPeriod: 'DAILY',
  historicalDays: 365,
  analysisStartDate: '2024-12-01',
  analysisEndDate: '2024-12-07',
  zScoreThreshold: 2.0,
  iqrMultiplier: 1.5,
  globalAnomalyRate: 75.0,
  showAllFlag: 'ANOMALY_ONLY'
};
```

### Senaryo 2: Haftalık Procedure Bazında Analiz
```javascript
const params = {
  progId: 12345,
  groupType: 'PROCEDURE',
  analysisPeriod: 'WEEKLY',
  historicalDays: 180,
  analysisStartDate: '2024-11-01',
  analysisEndDate: '2024-12-07',
  zScoreThreshold: 2.5,
  iqrMultiplier: 2.0,
  globalAnomalyRate: 80.0,
  showAllFlag: 'ALL'
};
```

### Senaryo 3: Aylık Package Bazında Analiz
```javascript
const params = {
  progId: 12345,
  groupType: 'PACKAGE',
  analysisPeriod: 'MONTHLY',
  historicalDays: 730,
  analysisStartDate: '2024-01-01',
  analysisEndDate: '2024-12-31',
  zScoreThreshold: 3.0,
  iqrMultiplier: 1.5,
  globalAnomalyRate: 70.0,
  showAllFlag: 'ANOMALY_ONLY'
};
```

## 📋 Sonuç Tablosu Kolonları

| Kolon | Açıklama | Format |
|-------|----------|--------|
| **Analiz Dönemi** | Analiz edilen zaman dilimi | YYYY-MM-DD |
| **Grup** | Step/Procedure/Package grubu | String |
| **Step ID** | İşlem adımı kimliği | String |
| **Süre (dk)** | İşlem süresi | XX.XX dakika |
| **Ort. Süre (dk)** | Ortalama işlem süresi | XX.XX dakika |
| **Z-Score** | İstatistiksel sapma değeri | X.XX |
| **Sapma %** | Ortalamadan sapma yüzdesi | XX.XX% |
| **Önem Derecesi** | Anomali önem seviyesi | NORMAL/MODERATE/HIGH/EXTREME |
| **Dönem Tipi** | Anomali türü | NORMAL/ISOLATED/PARTIAL/GLOBAL |
| **Açıklama** | Anomali açıklaması | Text |
| **Öneri** | Önerilen aksiyon | Text |

## 🚀 Performans Optimizasyonu

### SQL Optimizasyonu
- **Partitioning**: START_TM kolonunda partition
- **Indexing**: PROG_ID, STEP_ID, START_TM indexleri
- **CTE Kullanımı**: Modüler sorgu yapısı

### Frontend Optimizasyonu
- **Pagination**: 8 kayıt/sayfa
- **Lazy Loading**: Büyük veri setleri için
- **Caching**: API sonuçları cache'leme

## 🔒 Güvenlik Considerations

### Input Validation
- SQL Injection koruması
- Parametre tip kontrolü
- Tarih format validasyonu

### Error Handling
- Try-catch blokları
- User-friendly error mesajları
- Logging ve monitoring

## 🧪 Test Senaryoları

### Unit Tests
- Parametre validasyonu
- Veri dönüşüm fonksiyonları
- UI component testleri

### Integration Tests
- API endpoint testleri
- Database bağlantı testleri
- End-to-end workflow testleri

## 📚 Referanslar

### İstatistiksel Yöntemler
- [Z-Score Anomaly Detection](https://en.wikipedia.org/wiki/Standard_score)
- [Interquartile Range](https://en.wikipedia.org/wiki/Interquartile_range)
- [Modified Z-Score](https://www.itl.nist.gov/div898/handbook/eda/section3/eda35h.htm)

### Teknoloji Stack
- **Frontend**: React, CoreUI
- **Backend**: Java, Oracle SQL
- **Database**: Oracle EDW

## 🔄 Gelecek Geliştirmeler

### Planlanan Özellikler
- [ ] Machine Learning tabanlı anomali tespiti
- [ ] Real-time monitoring dashboard
- [ ] Email/SMS alert sistemi
- [ ] Trend analizi ve forecasting
- [ ] Custom threshold profilleri
- [ ] Export/Import konfigürasyon

### Teknik İyileştirmeler
- [ ] GraphQL API entegrasyonu
- [ ] Redis cache implementasyonu
- [ ] Microservice mimarisi
- [ ] Kubernetes deployment
- [ ] CI/CD pipeline optimizasyonu 