# INTERNAL key bot

## Быстрый старт (3 шага)

### 1. Заполни .env
Скопируй `.env.example` → `.env` и вставь значения:
```
BOT_TOKEN=   ← Bot tab → Reset Token
CLIENT_ID=   ← OAuth2 → Client ID  (уже вписан в примере — проверь)
GUILD_ID=    ← ПКМ по серверу → Copy Server ID  (нужен Dev Mode: Settings → Advanced)
```

### 2. Пригласи бота с Administrator
```
https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot+applications.commands&permissions=8
```
Замени `YOUR_CLIENT_ID` на свой. После инвайта: **Server Settings → Roles** — роль бота должна быть **выше** Owner/Admin/Member.

### 3. Запусти
```
npm install
node bot.js
```
При первом старте бот сам зарегает `/setup` и `/post`. Подожди 5-10 секунд, потом запускай `/setup` в дискорде.

---

## Что делает /setup
Создаёт (или чинит) всю структуру сервера:

| Категория | Каналы | Доступ |
|---|---|---|
| INFORMATION | welcome, rules, announcements, faq, get-access | все, только чтение |
| COMMUNITY | general, off-topic, support, suggestions, Lounge 🔊 | Member + |
| STAFF | admin-chat, bot-logs, Staff Room 🔊 | Moderator + |

**Роли:** Owner, Admin (Administrator), Moderator (модерация), Member.  
Существующие роли с теми же именами не трогаются.

Тексты (правила, welcome, faq и т.д.) постятся автоматически и пинятся.  
Повторный `/setup` обновляет их на месте, дублей нет.

## Get Key
- Кнопка в `#get-access` выдаёт ключ только тебе (ephemeral).
- Одновременно выдаёт роль **Member** → открывается COMMUNITY.
- Каждый новый ключ пишется в `#bot-logs` (сам ключ не логируется).

## Файлы
- `keys.json` — создаётся автоматически рядом с `bot.js`. Бэкапь его.
- `.env` — токены. Никому не показывай.
- `.deployed` — флаг что команды уже зарегали. Удали если хочешь перерегать.
