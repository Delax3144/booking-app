# KinoApp – system rezerwacji miejsc w kinie

KinoApp to aplikacja webowa umożliwiająca przeglądanie repertuaru, wybór seansu, rezerwację miejsc oraz zarządzanie własnymi rezerwacjami. Projekt został zbudowany w architekturze klient–serwer: frontend wykorzystuje **React + Vite**, a backend **Java 17 + Spring Boot**. Dane przechowywane są w bazie **MySQL**.

Projekt został rozszerzony o uwierzytelnianie **JWT**, haszowanie haseł **BCrypt**, ochronę endpointów przy użyciu **Spring Security** oraz automatyczne testy frontendu w **Jest + React Testing Library**.

## Technologie

### Frontend
- React 19
- React Router
- Vite 6
- Tailwind CSS 4
- Jest
- React Testing Library
- ESLint

### Backend
- Java 17
- Spring Boot 3.2
- Spring Security
- Spring Data JPA / Hibernate
- JWT (JJWT)
- BCrypt
- Maven

### Baza danych
- MySQL

## Główne funkcje

- rejestracja i logowanie użytkowników,
- generowanie tokenu JWT po poprawnym logowaniu lub rejestracji,
- przeglądanie listy filmów i godzin seansów,
- wyświetlanie zajętych miejsc,
- rezerwacja wybranych miejsc,
- podgląd własnych rezerwacji,
- usuwanie własnych rezerwacji,
- panel administratora do zarządzania filmami,
- ochrona operacji wymagających uwierzytelnienia,
- weryfikacja właściciela rezerwacji po stronie backendu.

## Bezpieczeństwo

Hasła użytkowników nie są przechowywane w postaci jawnej. Przed zapisaniem do bazy są haszowane za pomocą **BCrypt**.

Po poprawnym logowaniu backend generuje token **JWT**. Frontend dołącza go do chronionych zapytań w nagłówku:

```http
Authorization: Bearer <token>
```

Backend działa w trybie bezstanowym (`STATELESS`) i ustala tożsamość użytkownika na podstawie zweryfikowanego tokenu JWT. Adres e-mail przesyłany przez klienta nie jest używany do określania właściciela rezerwacji.

Publicznie dostępne są m.in. endpointy rejestracji i logowania, pobierania repertuaru oraz sprawdzania zajętych miejsc. Operacje na własnych rezerwacjach i operacje administracyjne wymagają poprawnego JWT.

## Struktura projektu

```text
booking-app/
├── booking-backend/
│   └── booking-api/          # Spring Boot API
├── booking-frontend/         # React + Vite
├── database.sql              # skrypt tworzący bazę i tabele
└── README.md
```

## Wymagania

Przed uruchomieniem projektu potrzebne są:

- Java 17,
- Node.js i npm,
- MySQL lub XAMPP,
- Git.

Projekt backendowy zawiera Maven Wrapper, dlatego osobna instalacja Mavena nie jest wymagana.

## Uruchomienie projektu lokalnie

### 1. Klonowanie repozytorium

```bash
git clone https://github.com/Delax3144/booking-app.git
cd booking-app
```

### 2. Konfiguracja bazy danych

Uruchom MySQL i utwórz bazę danych `booking_db`.

Możesz użyć dołączonego pliku:

```text
database.sql
```

lub wykonać ręcznie:

```sql
CREATE DATABASE IF NOT EXISTS booking_db;
```

Domyślna konfiguracja połączenia znajduje się w:

```text
booking-backend/booking-api/src/main/resources/application.properties
```

Domyślnie aplikacja korzysta z:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/booking_db?useSSL=false&serverTimezone=Europe/Warsaw&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=
```

Jeżeli lokalna instalacja MySQL używa innych danych logowania, należy odpowiednio zmienić `username` i `password`.

### 3. Konfiguracja JWT

Backend wymaga zmiennej środowiskowej `JWT_SECRET`. Nie należy zapisywać właściwego sekretu bezpośrednio w repozytorium.

Windows CMD:

```cmd
set JWT_SECRET=replace-with-a-long-random-secret
```

PowerShell:

```powershell
$env:JWT_SECRET="replace-with-a-long-random-secret"
```

Linux / macOS:

```bash
export JWT_SECRET="replace-with-a-long-random-secret"
```

### 4. Opcjonalne utworzenie konta administratora

Przy pierwszym uruchomieniu backend może automatycznie utworzyć konto:

```text
admin@gmail.com
```

W tym celu należy ustawić zmienną środowiskową `ADMIN_PASSWORD` przed startem aplikacji.

Windows CMD:

```cmd
set ADMIN_PASSWORD=your-admin-password
```

PowerShell:

```powershell
$env:ADMIN_PASSWORD="your-admin-password"
```

Linux / macOS:

```bash
export ADMIN_PASSWORD="your-admin-password"
```

Jeżeli użytkownik `admin@gmail.com` już istnieje w bazie, aplikacja nie nadpisuje jego hasła.

### 5. Uruchomienie backendu

Windows:

```cmd
cd booking-backend\booking-api
mvnw.cmd spring-boot:run
```

Linux / macOS:

```bash
cd booking-backend/booking-api
./mvnw spring-boot:run
```

Backend będzie dostępny pod adresem:

```text
http://localhost:8080
```

Przykładowy publiczny endpoint:

```text
http://localhost:8080/api/movies
```

### 6. Uruchomienie frontendu

W drugim terminalu:

```bash
cd booking-frontend
npm install
npm run dev
```

Frontend będzie dostępny pod adresem:

```text
http://localhost:5173
```

## Testy automatyczne

Frontend zawiera testy automatyczne przygotowane w **Jest + React Testing Library**. Obejmują m.in.:

- zapis i usuwanie danych uwierzytelnienia,
- dodawanie nagłówka `Authorization: Bearer ...`,
- obsługę odpowiedzi `401`,
- ochronę tras wymagających logowania,
- ochronę panelu administratora po stronie interfejsu,
- pobieranie zajętych miejsc,
- wysyłanie rezerwacji bez pola `userEmail`,
- obsługę błędu podczas tworzenia rezerwacji.

Uruchomienie testów:

```bash
cd booking-frontend
npm test
```

Aktualny zestaw obejmuje **14 testów w 4 zestawach testowych**.

## Kontrola jakości frontendu

Lint:

```bash
npm run lint
```

Build produkcyjny:

```bash
npm run build
```

## Panel administratora

Panel administratora jest dostępny po zalogowaniu jako:

```text
admin@gmail.com
```

Operacje administracyjne są dodatkowo weryfikowane przez backend. Sama zmiana danych w `localStorage` nie daje uprawnień do wykonania chronionych operacji API.

## Rozwiązywanie problemów

- sprawdź, czy MySQL jest uruchomiony i nasłuchuje na porcie `3306`,
- upewnij się, że istnieje baza `booking_db`,
- sprawdź, czy zmienna `JAVA_HOME` wskazuje na JDK 17,
- sprawdź, czy `JWT_SECRET` jest ustawiony w środowisku uruchamiającym backend,
- jeżeli potrzebujesz konta administratora na czystej bazie, ustaw `ADMIN_PASSWORD`,
- sprawdź logi Spring Boot oraz konsolę przeglądarki,
- w przypadku zmian zależności frontendu uruchom ponownie `npm install`.

## Autor

Projekt wykonany jako aplikacja inżynierska związana z implementacją warstwy front-endowej systemu rezerwacji seansów kinowych.
