# TERMINAL_CARD_ACCEPTOR Dataflow Report

Bu rapor, `EDW.TRX_ATM` tablosundaki `TERMINAL_CARD_ACCEPTOR` kolonunun veri akış analizini içerir.

## Rapor Yapısı

### Yeni Özellikler

Bu rapor, önceki raporlara göre geliştirilmiş bir yapıya sahiptir:

- **`occurrences`**: Her referansın kaç kez geçtiğini gösterir
- **`allLines`**: Referansın geçtiği tüm satır numaralarını içerir
- **`summary`**: Her referans için özet açıklama

### Hedef Tablo

```json
{
  "target": {
    "schema": "SNPADM",
    "table": "EDW.TRX_ATM", 
    "column": "TERMINAL_CARD_ACCEPTOR"
  }
}
```

### Özet İstatistikler

- **Toplam Paket Sayısı**: 54
- **Etkilenen Paket Sayısı**: 3
- **Direkt Referans**: 5
- **Dolaylı Referans**: 30
- **Toplam Etki**: 35

## Etkilenen Paketler

### 1. SNPADM.PKG_DA_CARDPLATFORMREMINDER
- **Direkt Referanslar**: 1 grup, 2 tekrar
- **Step**: P_CPR_TRX-40

### 2. SNPADM.PKG_DA_CP_PLATFORM_REMINDER  
- **Direkt Referanslar**: 2 grup, toplam 6 tekrar
- **Dolaylı Referanslar**: 19 grup, toplam 93 tekrar
- **Ana Steps**: DA_CP_PLATFORM_REMINDER-40, DA_CP_PLATFORM_REMINDER-120, vb.

### 3. SNPADM.PKG_DA_SUBSCRIPTION
- **Direkt Referanslar**: 2 grup, toplam 4 tekrar  
- **Dolaylı Referanslar**: 3 grup, toplam 26 tekrar
- **Ana Steps**: P_NEW_MERCHANTS-150, P_DA_SUBSCRIPTION-150, vb.

## Referans Tipleri

### Direkt Referanslar
- `DIRECT_ALIAS_COLUMN_REFERENCE`: Alias ile direkt kolon referansı
- `DIRECT_TABLE_REFERENCE`: Direkt tablo referansı

### Dolaylı Referanslar
- `SELECT_ALIAS_CREATION`: SELECT ile alias oluşturma
- `ALIAS_USAGE`: Alias kullanımı
- `TEMP_TABLE_CREATION`: Geçici tablo oluşturma

## Veri Akış Zinciri

1. **Kaynak**: `EDW.TRX_ATM.TERMINAL_CARD_ACCEPTOR`
2. **Alias Oluşturma**: `TRX_MRCHNT_ID` olarak alias oluşturuluyor
3. **Çoklu Kullanım**: Farklı step'lerde bu alias kullanılıyor
4. **Geçici Tablolar**: Bazı durumlarda geçici tablolarda saklanıyor

## Kullanım Alanları

- **Card Platform Reminder**: Kart platform hatırlatma işlemleri
- **Subscription Analysis**: Abonelik analizi
- **Merchant Analysis**: Merchant (satıcı) analizi

Bu rapor, veri lineage analizi için Data Lineage sayfasında görselleştirilebilir. 