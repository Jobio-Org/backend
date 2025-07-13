# Ендпойнт оновлення компанії

## Огляд

Ендпойнт `PUT /companies/:companyId` дозволяє користувачам з правами адміна (`CompanyRoleType.ADMIN`) редагувати інформацію про компанію.

## Авторизація

- **JWT токен**: Обов'язковий
- **Роль**: Тільки користувачі з роллю `ADMIN` в компанії
- **Дозвіл**: `EDIT_COMPANY_INFO`

## Ендпойнт

### PUT /companies/:companyId

**Оновлення інформації про компанію**

#### Параметри шляху
- `companyId` (string, required) - ID компанії для оновлення

#### Тіло запиту
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "website": "string (URL, optional)",
  "logo": "string (optional)",
  "industry": "string (optional)",
  "size": "string (optional)",
  "location": "string (optional)"
}
```

#### Приклад запиту
```bash
curl -X PUT "http://localhost:3000/companies/123e4567-e89b-12d3-a456-426614174000" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Company Name",
    "description": "Updated company description",
    "website": "https://example.com",
    "industry": "Technology",
    "size": "50-100",
    "location": "Kyiv, Ukraine"
  }'
```

#### Відповідь

**Успіх (200 OK)**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Updated Company Name",
  "description": "Updated company description",
  "website": "https://example.com",
  "logo": null,
  "industry": "Technology",
  "size": "50-100",
  "location": "Kyiv, Ukraine",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T12:00:00.000Z"
}
```

**Помилка авторизації (401 Unauthorized)**
```json
{
  "code": "INSUFFICIENT_PERMISSIONS",
  "message": "You do not have permission to edit company information"
}
```

**Помилка валідації (400 Bad Request)**
```json
{
  "code": "VALIDATION_FAILED",
  "message": "Validation failed",
  "errors": [
    {
      "field": "website",
      "message": "website must be a valid URL"
    }
  ]
}
```

**Компанія не знайдена (404 Not Found)**
```json
{
  "code": "COMPANY_NOT_FOUND",
  "message": "Company with id 123e4567-e89b-12d3-a456-426614174000 not found"
}
```

## Логіка роботи

1. **Перевірка авторизації**: Валідація JWT токена
2. **Перевірка прав доступу**: 
   - Отримання recruiterProfileId з userId
   - Перевірка наявності користувача в компанії
   - Перевірка дозволу `EDIT_COMPANY_INFO` для ролі користувача
3. **Оновлення компанії**: Часткове оновлення тільки переданих полів
4. **Повернення результату**: Оновлена компанія

## Валідація

- `name`: string, optional
- `description`: string, optional  
- `website`: URL, optional
- `logo`: string, optional
- `industry`: string, optional
- `size`: string, optional
- `location`: string, optional

## Безпека

- Тільки адміністратори компанії можуть редагувати інформацію
- Перевірка прав доступу на рівні дозволів
- Валідація всіх вхідних даних
- JWT авторизація

## Використання

Цей ендпойнт використовується для:
- Оновлення назви компанії
- Зміни опису компанії
- Оновлення контактної інформації (веб-сайт)
- Зміни галузі та розміру компанії
- Оновлення локації компанії 