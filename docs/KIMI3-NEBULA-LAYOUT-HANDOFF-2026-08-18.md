# Kimi 3: Nebula layout handoff

Дата: `2026-08-18`

Ветка поставки: `codex/kimi3-nebula-layouts-20260818`

Репозиторий: `cutthreat/nebula-gpt`

## Цель

Доверстать и привести к единому качеству последние локальные Nebula HTML/CSS/JS-макеты. Это layout/UI-задача. Не менять продуктовую логику, backend, database, payment, auth persistence или Figma.

## Обязательная совместимость с Yii2 backend

Nebula готовится к интеграции в существующий backend на Yii2. Поэтому результат Kimi 3 должен оставаться переносимой server-rendered версткой, а не отдельным frontend-приложением.

- Не добавлять React, Vue, Next, SPA-router, bundler/runtime или новый Node backend.
- Сохранять обычные HTML/CSS/JS-макеты как preview-слой; не требовать от Yii2 сборки, чтобы открыть страницу.
- Сохранять стабильные `id`, `class`, `name`, `data-*` и ARIA-атрибуты для последующего подключения Yii2 views, partials и контроллеров.
- Не переименовывать существующие селекторы и не менять DOM-контракт без причины, указанной в commit summary.
- Не придумывать URL, controller/action, API endpoint, модель ActiveRecord или схему БД. Для неизвестного маршрута оставить явный placeholder и записать вопрос в handoff.
- Не добавлять `fetch`, AJAX, WebSocket, оплату, авторизацию, persistence или fake API ради демонстрации. JS может управлять только локальным UI-состоянием, если это уже подтверждено текущим макетом.
- Формы должны оставаться совместимыми с обычным Yii2 submit: понятные `name`, корректные `type`, `label`, `button`, `required` и `autocomplete`; CSRF-защиту не отключать и не имитировать.
- Не встраивать PHP-выражения в статический preview без явного backend mapping. В отдельном комментарии/таблице указать, где Yii2 позже подставит данные: имя, avatar, price, status, messages, errors, pagination и URL.
- Все ссылки и assets должны быть локальными или относительными. Не добавлять CDN и внешние runtime-зависимости, если они не зарегистрированы текущим проектом.
- Не менять layout-слой на database/business logic. После интеграции backend-разработчик должен иметь возможность вынести части в Yii2 partials без переписывания CSS.

### Что подготовить для последующей Yii2 интеграции

Для каждого изменённого семейства Kimi 3 должен указать в commit summary:

1. какой static entry point открыт для визуальной проверки;
2. какие блоки станут Yii2 view/partial;
3. какие данные являются backend-owned и сейчас показаны fixture/placeholder;
4. какие actions требуют controller/action или API-контракта и потому не реализуются в этой задаче;
5. какие селекторы являются integration hooks;
6. какие assets нужно подключить через Yii2 AssetBundle после переноса.

Рабочая граница: Kimi 3 отвечает за HTML/CSS/локальный UI-preview, backend-разработчик отвечает за Yii2 views, controllers, validation, permissions, ActiveRecord, migrations, API/WebSocket и реальные transitions. Нельзя смешивать эти два слоя в одном commit.

## Где лежат исходники

Рабочий корень репозитория: `H:\Nebula\GPT`

Основной рабочий слой макетов:

- `_unzipped/` — актуальные локальные HTML/CSS/JS и производственные ассеты;
- `_unzipped/img/` — локальные изображения и иконки, используемые макетами;
- `home.html`, `home.css`, `home.js` — публичная home-поверхность;
- `auth-login-state-new.html`, `auth-login.css`, `figma-auth.css`, `figma-auth.js` — auth family;
- `lk-chatroom-c76.html`, `lk-chatroom-c76.css`, `lk-chatroom-c76.js` — C76 Chatroom family;
- `lk-chatroom-c76-paid-active.html`, `lk-chatroom-c76-paid-active.css`, `lk-chatroom-c76-paid-active.js` — paid-active visual context;
- `nebula-easy-*.html/css/js` — latest easy/static page projections;
- `all-psychic-new.*`, `love-reading-new.*`, `palm-reading-new.*`, `psychic-reading-new.*`, `tarot-reading-new.*` — canonical service-family layout sources;
- `zodiac-compatibility-new.html`, `zodiac-sign-traits-new.html` — zodiac family;
- `expert-page-new.html`, `profile-user-new.html`, `psychic-chat-new.html` — profile/chat heritage surfaces.

Корневые route folders (`all-psychic/`, `love-reading/`, `palm-reading/`, `psychic-reading/`, `tarot-reading/`, `zodiac-compatibility/` и другие) — публикуемые проекции. Если файл в `_unzipped/` и route projection расходятся, сначала сравнить source lineage; не перетирать один слой автоматически.

## Source hierarchy

1. Owner-approved Nebula product decisions и локальные PM packets.
2. Точные C76/Figma source maps и зарегистрированные visual frames.
3. Текущий локальный HTML/CSS/JS runtime.
4. AskNebula — только reference для обычной семантики discovery/profile/chat; не source truth для Nebula visual или product policy.
5. Старые review boards, debug pages, screenshots и архивы — evidence/reference, не production source.

## Семейства, которые нужно проверить в первую очередь

1. `all-psychic` — общий каталог/витрина.
2. `love-reading` — service landing.
3. `palm-reading` и `palm-reading-scanner` — различать landing и scanner/tool semantics.
4. `psychic-reading` — service landing.
5. `tarot-reading` — public landing; не добавлять несуществующий Tarot tool flow.
6. `zodiac-compatibility` и `zodiac-sign-traits` — public content/compatibility family.
7. Auth: login, signup, forgot password, confirmation.
8. `lk-chatroom-c76` — selected-empty/default Chatroom family.
9. Home, profile and expert catalog heritage surfaces.

## Responsive contract

Проверять каждую применимую страницу на пяти ширинах: `1200`, `992`, `768`, `576`, `320`.

Ширина — это breakpoint evidence, а не отдельная продуктовая state. Не переносить desktop layout на mobile простым масштабированием. Проверять nav/offcanvas, порядок блоков, карточки, action controls, text wrapping, overflow, focus and keyboard behavior.

## Правила работы Kimi 3

- Не изобретать отсутствующие элементы: использовать exact local source/heritage component.
- Не менять смысл CTA, статусы, payment/session transitions или role permissions ради визуального совпадения.
- Не объявлять backend-функцию реализованной из-за кнопки или local state.
- Не добавлять fake success для auth, payment, service session, persistence, booking или paid chat.
- Для Chatroom сохранить границу: visual placeholder допустим, backend side effect — нет.
- Для Tarot public landing не добавлять question/card/result/payment/history state machine.
- Для Zodiac header на 992 сохранить desktop 1200 и mobile 768/576/320 behavior; drawer должен иметь полный open/close/focus-return lifecycle.
- Изменять только нужный component/page family. Не делать глобальную CSS-перепись без доказанной общей причины.
- Не удалять и не перезаписывать чужие незакоммиченные изменения.
- Не использовать screenshots/review boards как CSS source.

## Что считать готовым по layout

Для каждой страницы:

1. source file и matching CSS/JS определены;
2. visual comparison выполнен на пяти ширинах;
3. нет горизонтального overflow, clipping или overlap;
4. text, buttons и cards не выходят из контейнера;
5. focus/hover/keyboard states не ломают layout;
6. mobile nav/offcanvas открывается и закрывается без stale state;
7. assets загружаются локально без внешних URL, если локальный asset уже есть;
8. console/runtime errors проверены в локальном preview;
9. изменённые файлы перечислены в commit summary;
10. backend-dependent behavior отмечен как `frontend_placeholder` или `backend_blocked`, а не как done.

## Локальный запуск и проверки

Из корня репозитория:

```powershell
cd H:\Nebula\GPT
python -m http.server 8787
```

Перед commit:

```powershell
cd H:\Nebula\GPT
pwsh -NoProfile -ExecutionPolicy Bypass -File .github/scripts/quality-gate.ps1 -Phase all
```

Примеры URL: `home.html`, `all-psychic-new.html`, `love-reading-new.html`, `palm-reading-new.html`, `psychic-reading-new.html`, `tarot-reading-new.html`, `zodiac-compatibility-new.html`, `lk-chatroom-c76.html`.

## Git workflow для Kimi 3

```powershell
git clone https://github.com/cutthreat/nebula-gpt.git
cd nebula-gpt
git switch codex/kimi3-nebula-layouts-20260818
pwsh -NoProfile -ExecutionPolicy Bypass -File .github/scripts/quality-gate.ps1 -Phase all
```

После правок:

```powershell
git status --short
git diff --stat
git add <только изменённые layout/css/js/assets и этот handoff>
git commit -m "Refine Nebula layouts"
git push github codex/kimi3-nebula-layouts-20260818
```

## Границы задачи

Backend/product owner должен отдельно подтвердить auth/session persistence, service session lifecycle, payment, credits, timer/debit, refund/coupon, expert assignment, availability, realtime persistence, booking, notifications и email.

Kimi 3 может подготовить UI states и placeholders, но не может выдавать эти функции за runtime-реализованные.

## PM acceptance packet

В ответе на работу вернуть changed files, page families and widths checked, screenshots/proof paths, visual regressions, frontend placeholders, backend blockers, remaining owner decisions и exact commit SHA.
