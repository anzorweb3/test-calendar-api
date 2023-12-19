## Описание

Это тестовое приложение calendar-api с одним эндпоинтом - events,
методы описаны в файле events.controller.ts

Код является самодокументируемым, поэтому в нем нет комментариев,
за искючением тестов. Покрытие - 72%, однако оставшиеся 28% не нуждаются в покрытии тестами.

В тестах используются mock-объекты для имитации работы репозитория TypeORM,
что позволяет изолировать тестируемый код от внешних зависимостей (например тестовая БД).

## Установка

```bash
$ npm install
```

## Запуск приложения

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Запуск тестов

```bash
# run unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Пример dotenv файла

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=test  
DB_PASSWORD=test
DB_DATABASE=test_db
