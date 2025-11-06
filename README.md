# 🔐 Portfolio mit Zugriffskontrolle

Ein geschütztes Portfolio-System mit Einladungslinks, Zeitbegrenzung und Admin-Dashboard.

## 🚀 Setup

**📖 Folge der Anleitung in `SERVER_SETUP.md`**

Diese Datei enthält eine komplette Schritt-für-Schritt-Anleitung für:
- ✅ Supabase komplett neu einrichten
- ✅ Code auf GitHub hochladen (nur nötige Dateien)
- ✅ Auf deinem Server deployen (PM2 + Nginx)
- ✅ Testen und Wartung

## 📋 Features

### Zugriffskontrolle
- ✅ **Einladungslinks-System**: Nur mit Link kann man sich registrieren
- ✅ **30-Tage-Zugriff**: Automatische Ablaufprüfung
- ✅ **Geschütztes Portfolio**: Nur für eingeloggte Nutzer sichtbar
- ✅ **Verlängerungsanfragen**: Nutzer können mehr Zeit anfragen

### Admin-Dashboard
- ✅ **Firmenverwaltung**: Nutzer aktivieren/deaktivieren
- ✅ **Einladungen erstellen**: Neue Links generieren
- ✅ **Verlängerungen prüfen**: Anfragen genehmigen/ablehnen
- ✅ **Content-Management**: Portfolio-Inhalte bearbeiten
- ✅ **Theme-Anpassungen**: Farben, Hintergrund, Schriftart ändern
- ✅ **Aktivitätsprotokolle**: Alle Ereignisse überwachen
- ✅ **Passwort ändern**: Sicheres Passwort-Management

### Portfolio
- ✅ **Über mich**: Persönliche Vorstellung
- ✅ **Projekte**: Detaillierte Projektbeschreibungen
- ✅ **Fähigkeiten**: Tech Stack Übersicht
- ✅ **Kontakt**: Social Media & E-Mail
- ✅ **Zugriffszähler**: Verbleibende Tage anzeigen

## 🔒 Sicherheit

- **Portfolio ist geschützt**: Nur eingeloggte Nutzer können es sehen
- **Registrierung nur mit Link**: Niemand kann sich ohne Einladung registrieren
- **Row Level Security (RLS)**: Datenbank-Sicherheit in Supabase
- **Passwort-Hashing**: Sichere Passwort-Speicherung
- **Session-Management**: Automatische Token-Verwaltung

## 🛠️ Technologie

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (Auth + PostgreSQL)
- **Server**: PM2 + Nginx (auf deinem Ubuntu Server)
- **Versionskontrolle**: GitHub

## 📧 Admin-Login

**E-Mail**: zsmolii@icloud.com  
**Passwort**: Admin (bitte nach erstem Login ändern!)

## 📧 Kontakt

Bei Fragen: zsmolii@icloud.com

---

**Wichtig**: Die `.gitignore` Datei stellt sicher, dass keine sensiblen Daten (wie `.env.local`) auf GitHub hochgeladen werden!
