# Nebula: handoff личного кабинета и чата для backend-интеграции

Дата пакета: 2026-09-14
Статус: `frontend_host_intent_milestone_complete_at_authority_boundary`

## С чего начать

1. Работать только с вариантом `experiments/nebula-account-chat-live-20260809`.
2. Прочитать `CODEX.md` и `integration-contract.json` в этой папке.
3. Открыть `yii2/modules/nebulaAccount/config/routes.php`, затем владельцев экранов из `integration-contract.json`.
4. До изменения интерфейса заполнить ответ на `proof/module-inventory/backend-owner-questionnaire-2026-08-12.md` и прогнать `verify-handoff.ps1`.

## Что передаётся

- Yii2-совместимый модуль: `yii2/modules/nebulaAccount/`.
- Статический интерактивный preview: `preview/`.
- Исходные C76/Figma-привязки: `source/`.
- Доказательства пяти ширин и локальных интеракций: `proof/`.
- Человеческий маршрут, машинный контракт и проверка состава: эта папка.

## Публичная верстка

Полностью статическая версия опубликована через GitHub Pages и открывается с любого ПК:

- [вход в кабинет и чат](https://cutthreat.github.io/nebula-pages-public/nebula-account/);
- [Chatroom](https://cutthreat.github.io/nebula-pages-public/nebula-account/chatroom.html);
- [Profile](https://cutthreat.github.io/nebula-pages-public/nebula-account/profile.html).

Это полный client-only preview: HTML, CSS, JavaScript, изображения и шрифты размещены в Git-репозитории `cutthreat/nebula-pages-public` (ветка `main`). Публичный просмотр не передаёт реальные данные и не выполняет backend-операции.

## Реально готово

- 50 из 54 единиц кабинета/чата приняты в изолированном Yii2-контуре; 27 ожидаемых GET-маршрутов имеют статическую проекцию.
- Основные владельцы: профиль (`ProfileController`/`ProfileAsset`), чат (`ChatroomController`/`ChatroomAsset`), уведомления чата (`ChatroomNotifyController`/`ChatroomNotifyAsset`).
- Для профиля и default-chatroom зафиксированы C76-узлы на 1200/992/768/576/320 px.

## Важно: чего здесь нет

Верстка **не** является готовым runtime. Не реализованы и не должны имитироваться: auth, сохранение профиля/настроек, фактическая отправка и доставка сообщений, загрузка вложений, платежи, изменение credit balance, серверный lifecycle/timer платной сессии, read receipts и production deploy.

Две единицы остаются `route-intent-unbound` (g02, g03); две — `source-blocked` (g50 media, paid-active lifecycle). Это не дефекты верстки, а входные контракты backend/product.

## Первый backend-срез

Начинать с одного вертикального сценария:

`авторизованный клиент → список диалогов → открыть диалог → отправить текст → идемпотентный ответ API → сохранённое сообщение → read/delivery состояние`.

Платную сессию, списания, timer и payment подключать только отдельным следующим контрактом после этого среза. Полный перечень обязательных полей и границ — в `integration-contract.json`.

## Контроль качества

Перед передачей изменений в review:

```powershell
Set-Location F:\CodexProjects\confideline-nebula\implementation\nebula-gpt
& .\experiments\nebula-account-chat-live-20260809\handoff\backend-integration-20260914\verify-handoff.ps1
```

Проверка убеждается, что все ключевые файлы и доказательства на месте, а их SHA-256 совпадает с зафиксированным manifest. Она не подтверждает backend-runtime.

## Граница источника истины

- Визуальная структура: C76/Figma и `source/*`.
- Текущие Yii2-владельцы и маршруты: `yii2/modules/nebulaAccount/*`.
- Исторические proof: `proof/*`; перед релизом их нужно обновить на текущем host/runtime.
- Product/backend-решения: только после ответа владельца в `backend-owner-questionnaire-2026-08-12.md`.
