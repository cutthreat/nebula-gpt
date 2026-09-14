# Инструкция для Codex: backend handoff Nebula Cabinet + Chat

## Цель

Подключить существующую Yii2-верстку к backend по контрактам, не подменяя серверную правду локальными fixture-эффектами.

## Неизменяемые границы

- Канонический вариант: `experiments/nebula-account-chat-live-20260809`.
- Не менять Home, Aura, `nebula-easy-*`, архивы и production routes.
- Не переписывать account/chat shells и не заменять C76-структуру без доказанной необходимости.
- Не добавлять fake-success: `sent`, `delivered`, `paid`, `debited`, `saved` или `completed` допустимы только из серверного результата.
- Не обрабатывать секреты, cookies, tokens или платёжные реквизиты в исходниках/логах.

## Порядок работы

1. Запусти `verify-handoff.ps1`.
2. Прочти `integration-contract.json` и ответ backend owner. Если ответа нет — подготовь его, но не выдумывай API.
3. Реализуй только `chat_message_delivery_v1`: список, thread, submit, idempotency, pending/error/delivered, повтор после ошибки и snapshot после reload.
4. Сохрани существующие C76 breakpoint-композиции `1200/992/768/576/320`.
5. Добавь контрактные тесты: authorised/unauthorised, duplicate idempotency key, stale conversation, retry/timeout и refresh/readback.
6. Обнови доказательства только на реальном локальном host/runtime; статическая проверка не равна приёмке backend.

## Точки входа

| Область | Текущий владелец |
|---|---|
| Маршруты | `yii2/modules/nebulaAccount/config/routes.php` |
| Профиль | `controllers/ProfileController.php`, `views/profile/index.php`, `assets/ProfileAsset.php` |
| Список/тред/композер | `controllers/ChatroomController.php`, `views/chatroom/index.php`, `views/partials/chat-*`, `assets/ChatroomAsset.php` |
| Chatroom Notify | `controllers/ChatroomNotifyController.php`, `views/chatroom-notify/index.php`, `assets/ChatroomNotifyAsset.php` |
| Состояние active | `views/chatroom/active.php`, `_chatroom-active.php`, `assets/ChatroomActiveAsset.php` |

## Стоп-условия

Остановись и зафиксируй вопрос, если отсутствуют: owner API, схема/версии payload, auth policy, idempotency rule, authoritative server states, pagination/cursor contract, или правила доступа к conversation. Не обходи это localStorage, fixture store или клиентским timer.

## Приёмка первого среза

Готово только если реальный host демонстрирует: серверный snapshot, доступ только к своим диалогам, один message при повторе ключа идемпотентности, честные pending/error/delivered, reload/readback без дублей и сохранение visual parity на пяти ширинах.
