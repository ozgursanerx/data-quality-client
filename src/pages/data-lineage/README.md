# Data Lineage Görselleştirmesi

Bu sayfa, veri tabanı tablolarındaki kolonların paketlerde nasıl kullanıldığını görselleştiren bir data lineage aracıdır.

## Özellikler

### 📊 Çoklu Veri Kaynağı Desteği
- **CUSTOMERNUMBER Analizi**: EDW.CLLTN_PLTFRM_CUSTMR_DCSN.CUSTOMERNUMBER kolonu
- **CARD_TP Analizi**: SNPADM.CDM.CC_DAILY.CARD_TP kolonu
- **CUST_ID Analizi**: SNPADM.EDWCRM.CRM_WNC_CUSTOMER.CUST_ID kolonu
- Dropdown menüden veri kaynağı seçimi
- Otomatik parametre güncelleme

### 🔍 Arama Parametreleri
- **Şema Adı**: Hedef tablonun şema adı
- **Tablo Adı**: Hedef tablo adı  
- **Kolon Adı**: Analiz edilecek kolon adı

### 📊 Görselleştirme
- **ReactFlow** tabanlı interaktif diyagram
- **Kaynak Tablo** (mavi): Analiz edilen tablo ve kolon
- **Paketler** (turuncu): Kolonu kullanan paketler
- **Adımlar** (mor): Paket içindeki spesifik adımlar

### 📈 Metrikler
- **Risk Skoru**: Paketin risk seviyesi
- **Direkt Referanslar**: Doğrudan kolon kullanımları
- **Dolaylı Referanslar**: Alias, temp table vb. üzerinden kullanımlar

### 🔗 Detay Görüntüleme
- Adım node'larına tıklayarak detaylı referans bilgileri görüntülenebilir
- Modal pencerede SQL kodları ve referans tipleri gösterilir

## Bileşen Yapısı

```
src/pages/data-lineage/
├── DataLineage.js              # Ana sayfa bileşeni
├── DataLineage.css             # Özel stiller
├── README.md                   # Bu dosya
└── components/
    ├── DataLineageVisualization.js  # ReactFlow görselleştirme
    ├── CustomNode.js               # Özel node bileşeni
    └── NodeDetailsModal.js         # Detay modal bileşeni
```

## Veri Kaynakları

### 1. CUSTOMERNUMBER Analizi
- **Dosya**: `docs/customernumber_dataflow_report.json`
- **Hedef**: EDW.CLLTN_PLTFRM_CUSTMR_DCSN.CUSTOMERNUMBER
- **Kapsamı**: 1 paket, 20 toplam etki
- **Özellik**: Direkt ve dolaylı referanslar, alias kullanımları

### 2. CARD_TP Analizi  
- **Dosya**: `docs/card_tp_dataflow_report.json`
- **Hedef**: SNPADM.CDM.CC_DAILY.CARD_TP
- **Kapsamı**: 7 paket, 58 toplam etki
- **Özellik**: Çok sayıda paket ve referans, kompleks bağımlılıklar

### 3. CUST_ID Analizi
- **Dosya**: `docs/cust_id_dataflow_report.json`
- **Hedef**: SNPADM.EDWCRM.CRM_WNC_CUSTOMER.CUST_ID
- **Kapsamı**: 1 paket, 10 toplam etki
- **Özellik**: Orta seviye karmaşıklık, WNC müşteri analizi

## Veri Formatı

Her JSON dosyası aşağıdaki formatı takip eder:

```json
{
  "timestamp": "2025-06-19T05:14:48.323Z",
  "target": {
    "schema": "SNPADM",
    "table": "CDM.CC_DAILY",
    "column": "CARD_TP"
  },
  "summary": {
    "totalPackages": 54,
    "impactedPackages": 7,
    "directReferences": 58,
    "indirectReferences": 0,
    "totalImpact": 58
  },
  "packageAnalysis": [
    {
      "packageName": "SNPADM.PKG_DA_CARDPLATFORMREMINDER",
      "riskScore": 50,
      "directReferences": [...],
      "indirectReferences": [...]
    }
  ]
}
```

## Kullanım

1. Navbar'dan "Data Lineage" menüsüne tıklayın
2. **Veri Kaynağı** dropdown'dan analiz etmek istediğiniz kolonu seçin
3. Gerekirse şema, tablo ve kolon bilgilerini düzenleyin
4. "Analiz Et" butonuna basın
5. Görselleştirmede node'lara tıklayarak detayları görün
6. Minimap ve kontroller ile diyagramda gezinin

## Karşılaştırma

| Özellik | CUSTOMERNUMBER | CARD_TP | CUST_ID |
|---------|----------------|---------|---------|
| Toplam Paket | 13 | 54 | 2 |
| Etkilenen Paket | 1 | 7 | 1 |
| Direkt Referans | 7 | 58 | 10 |
| Dolaylı Referans | 13 | 0 | 0 |
| Toplam Etki | 20 | 58 | 10 |
| Risk Skoru | 235 | 1450 | 500 |
| Komplekslik | Orta | Yüksek | Düşük |
| Kullanım Alanı | Koleksiyon | Kart İşlemleri | WNC Müşteri |

## Teknolojiler

- **React**: UI framework
- **ReactFlow**: Diyagram görselleştirme
- **CoreUI**: UI bileşenleri
- **D3.js**: Veri manipülasyonu (gelecek özellikler için) 