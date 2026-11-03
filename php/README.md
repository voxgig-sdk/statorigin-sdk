# Statorigin PHP SDK



The PHP SDK for the Statorigin API — an entity-oriented client using PHP conventions.

The SDK exposes the API as capitalised, semantic **Entities** — for example `$client->Indicator()` — with named operations (`list`/`load`) instead of raw URL paths and query strings. Working with resources and verbs keeps call sites self-describing and reduces cognitive load.

> Other languages, the CLI, and MCP server live alongside this one — see
> the [top-level README](../README.md).


## Install
This package is not yet published to Packagist. Install it from the
GitHub release tag (`php/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/statorigin-sdk/tags)), or
from a clone as a Composer path repository:

```bash
git clone https://github.com/voxgig-sdk/statorigin-sdk
composer config repositories.statorigin-sdk path ./statorigin-sdk/php
composer require voxgig-sdk/statorigin-sdk:@dev
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```php
<?php
require_once 'statorigin_sdk.php';

$client = new StatoriginSDK();
```

### 2. List indicator records

```php
try {
    // list() returns entity instances; data_get() reads each record.
    $indicators = $client->Indicator()->list();
    foreach ($indicators as $record) {
        $item = $record->data_get();
        echo $item["slug"] . " " . $item["definition"] . "\n";
    }
} catch (\Throwable $err) {
    echo "Error: " . $err->getMessage();
}
```

### 3. Load an indicator

```php
try {
    // load() returns the ENTITY — call data_get() for the Indicator record (throws on error).
    $indicator = $client->Indicator()->load(["id" => "example_id"]);
    print_r($indicator->data_get());
} catch (\Throwable $err) {
    echo "Error: " . $err->getMessage();
}
```


## Error handling

Entity operations throw a `\Throwable` on failure, so wrap them in
`try` / `catch`:

```php
try {
    $industrys = $client->Industry()->list();
} catch (\Throwable $err) {
    echo "Error: " . $err->getMessage();
}
```

`direct()` does **not** throw — it returns the result array. Branch on
`ok`; on failure `status` holds the HTTP status (for error responses) and
`err` holds a transport error, so read both defensively:

```php
$result = $client->direct([
    "path" => "/api/resource/{id}",
    "method" => "GET",
    "params" => ["id" => "example_id"],
]);

if (! $result["ok"]) {
    $err = $result["err"] ?? null;
    echo "request failed: " . ($err ? $err->getMessage() : "HTTP " . $result["status"]);
}
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```php
// direct() is the raw-HTTP escape hatch: it returns a result array
// (it does not throw). Branch on $result["ok"].
$result = $client->direct([
    "path" => "/api/resource/{id}",
    "method" => "GET",
    "params" => ["id" => "example"],
]);

if ($result["ok"]) {
    echo $result["status"];  // 200
    print_r($result["data"]);  // response body
} else {
    // On an HTTP error status there is no err (only a transport failure sets
    // it), so fall back to the status code.
    $err = $result["err"] ?? null;
    echo "Error: " . ($err ? $err->getMessage() : "HTTP " . $result["status"]);
}
```

### Prepare a request without sending it

```php
// prepare() throws on error and returns the fetch definition.
$fetchdef = $client->prepare([
    "path" => "/api/resource/{id}",
    "method" => "DELETE",
    "params" => ["id" => "example"],
]);

echo $fetchdef["url"];
echo $fetchdef["method"];
print_r($fetchdef["headers"]);
```

### Use test mode

Create a mock client for unit testing — no server required. Seed fixture
data via the `entity` option so offline calls resolve without a live server:

```php
$client = StatoriginSDK::test([
    "entity" => ["industry" => ["test01" => ["id" => "test01"]]],
]);

// list() returns entity instances (throws on error);
// call data_get() for the mock record.
$industry = $client->Industry()->list();
print_r(array_map(fn($item) => $item->data_get(), $industry));
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```php
$mock_fetch = function ($url, $init) {
    return [
        [
            "status" => 200,
            "statusText" => "OK",
            "headers" => [],
            "json" => function () { return ["id" => "mock01"]; },
        ],
        null,
    ];
};

$client = new StatoriginSDK([
    "base" => "http://localhost:8080",
    "system" => [
        "fetch" => $mock_fetch,
    ],
]);
```

### Run live tests

Create a `.env.local` file at the project root:

```
STATORIGIN_TEST_LIVE=TRUE
```

Then run:

```bash
cd php && ./vendor/bin/phpunit test/
```


## Reference

### StatoriginSDK

```php
require_once 'statorigin_sdk.php';
$client = new StatoriginSDK($options);
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `array` | Feature activation flags. |
| `extend` | `array` | Additional Feature instances to load. |
| `system` | `array` | System overrides (e.g. custom `fetch` callable). |

### test

```php
$client = StatoriginSDK::test($testopts, $sdkopts);
```

Creates a test-mode client with mock transport. Both arguments may be `null`.

### StatoriginSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `options_map` | `(): array` | Deep copy of current SDK options. |
| `get_utility` | `(): Utility` | Copy of the SDK utility object. |
| `prepare` | `(array $fetchargs): array` | Build an HTTP request definition without sending. |
| `direct` | `(array $fetchargs): array` | Build and send an HTTP request. |
| `Indicator` | `($data): IndicatorEntity` | Create an Indicator entity instance. |
| `Industry` | `($data): IndustryEntity` | Create an Industry entity instance. |
| `Region` | `($data): RegionEntity` | Create a Region entity instance. |
| `Search` | `($data): SearchEntity` | Create a Search entity instance. |
| `Source` | `($data): SourceEntity` | Create a Source entity instance. |
| `Statistic` | `($data): StatisticEntity` | Create a Statistic entity instance. |

### Entity interface

All entities share the same interface.

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `($reqmatch, $ctrl): mixed` | Load a single entity by match criteria, and return it. |
| `list` | `(?array $reqmatch = null, $ctrl): mixed` | List entities matching the criteria (call with no argument to list all), one per record. |
| `data_get` | `(): array` | Get entity data. |
| `data_set` | `($data): void` | Set entity data. |
| `match_get` | `(): array` | Get entity match criteria. |
| `match_set` | `($match): void` | Set entity match criteria. |
| `make` | `(): Entity` | Create a new instance with the same options. |
| `get_name` | `(): string` | Return the entity name. |

### Result shape

Entity operations return the entity, and `list` an `array` of entities, one
per record; an entity's `data_get()` reads its record (an `array`). They
throw on error, so wrap calls in `try`/`catch` to handle failures.

The `direct()` escape hatch never throws — it returns a result `array`
you branch on via `$result["ok"]`:

| Key | Type | Description |
| --- | --- | --- |
| `ok` | `bool` | `true` if the HTTP status is 2xx. |
| `status` | `int` | HTTP status code. |
| `headers` | `array` | Response headers. |
| `data` | `mixed` | Parsed JSON response body. |

On error, `ok` is `false` and `$err` contains the error value.

### Entities

#### Indicator

| Field | Description |
| --- | --- |
| `definition` |  |
| `id` | Stable prefixed identifier. |
| `name` |  |
| `slug` | URL key: the item routes take this. |
| `unit` |  |

Operations: List, Load.

API path: `/indicators`

#### Industry

| Field | Description |
| --- | --- |
| `id` | Stable prefixed identifier. |
| `isic` |  |
| `level` |  |
| `name` |  |
| `parent_id` |  |
| `slug` | URL key: the item routes take this. |

Operations: List, Load.

API path: `/industries`

#### Region

| Field | Description |
| --- | --- |
| `data` |  |
| `meta` |  |

Operations: List.

API path: `/regions`

#### Search

| Field | Description |
| --- | --- |

Operations: Load.

API path: `/search`

#### Source

| Field | Description |
| --- | --- |
| `id` | Stable prefixed identifier. |
| `name` |  |
| `short_name` |  |
| `slug` | URL key: the item routes take this. |
| `tier` |  |
| `type` |  |

Operations: List, Load.

API path: `/sources`

#### Statistic

| Field | Description |
| --- | --- |
| `citation` |  |
| `confidence` |  |
| `currency` |  |
| `id` |  |
| `indicator` |  |
| `industry` |  |
| `is_current` | False once superseded_by is set |
| `is_secondhand` | True when the figure was relayed from a secondary source |
| `period` |  |
| `region` |  |
| `scale` |  |
| `source` | Complete provenance. |
| `superseded_by` | Id of the newer record that corrected this one. |
| `supersedes` | Id of the older record this one corrected, if any |
| `unit` |  |
| `updated_at` |  |
| `url` |  |
| `value` |  |
| `value_text` | The source's own phrasing, preserved verbatim |
| `value_type` |  |
| `verification` |  |
| `verified_at` |  |
| `verified_by` |  |

Operations: List, Load.

API path: `/statistics`



## Entities


### Indicator

Create an instance: `$indicator = $client->Indicator();`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `definition` | `string` |  |
| `id` | `string` | Stable prefixed identifier. |
| `name` | `string` |  |
| `slug` | `string` | URL key: the item routes take this. |
| `unit` | `string` |  |

#### Example: Load

```php
// load() returns the ENTITY — call data_get() for the Indicator record (throws on error).
$indicator = $client->Indicator()->load(["id" => "indicator_id"]);
```

#### Example: List

```php
// list() returns an array of Indicator entities, one per record (throws on error).
$indicators = $client->Indicator()->list();
```


### Industry

Create an instance: `$industry = $client->Industry();`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Stable prefixed identifier. |
| `isic` | `string` |  |
| `level` | `int` |  |
| `name` | `string` |  |
| `parent_id` | `string` |  |
| `slug` | `string` | URL key: the item routes take this. |

#### Example: Load

```php
// load() returns the ENTITY — call data_get() for the Industry record (throws on error).
$industry = $client->Industry()->load(["id" => "industry_id"]);
```

#### Example: List

```php
// list() returns an array of Industry entities, one per record (throws on error).
$industrys = $client->Industry()->list();
```


### Region

Create an instance: `$region = $client->Region();`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `data` | `array` |  |
| `meta` | `array` |  |

#### Example: List

```php
// list() returns an array of Region entities, one per record (throws on error).
$regions = $client->Region()->list();
```


### Search

Create an instance: `$search = $client->Search();`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Example: Load

```php
// load() returns the ENTITY — call data_get() for the Search record (throws on error).
$search = $client->Search()->load(["q" => "q"]);
```


### Source

Create an instance: `$source = $client->Source();`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Stable prefixed identifier. |
| `name` | `string` |  |
| `short_name` | `string` |  |
| `slug` | `string` | URL key: the item routes take this. |
| `tier` | `int` |  |
| `type` | `string` |  |

#### Example: Load

```php
// load() returns the ENTITY — call data_get() for the Source record (throws on error).
$source = $client->Source()->load(["id" => "source_id"]);
```

#### Example: List

```php
// list() returns an array of Source entities, one per record (throws on error).
$sources = $client->Source()->list();
```


### Statistic

Create an instance: `$statistic = $client->Statistic();`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `citation` | `array` |  |
| `confidence` | `mixed` |  |
| `currency` | `mixed` |  |
| `id` | `string` |  |
| `indicator` | `array` |  |
| `industry` | `array` |  |
| `is_current` | `bool` | False once superseded_by is set |
| `is_secondhand` | `bool` | True when the figure was relayed from a secondary source |
| `period` | `array` |  |
| `region` | `array` |  |
| `scale` | `string` |  |
| `source` | `array` | Complete provenance. |
| `superseded_by` | `mixed` | Id of the newer record that corrected this one. |
| `supersedes` | `mixed` | Id of the older record this one corrected, if any |
| `unit` | `string` |  |
| `updated_at` | `string` |  |
| `url` | `string` |  |
| `value` | `float` |  |
| `value_text` | `mixed` | The source's own phrasing, preserved verbatim |
| `value_type` | `string` |  |
| `verification` | `string` |  |
| `verified_at` | `mixed` |  |
| `verified_by` | `mixed` |  |

#### Example: Load

```php
// load() returns the ENTITY — call data_get() for the Statistic record (throws on error).
$statistic = $client->Statistic()->load(["id" => "statistic_id"]);
```

#### Example: List

```php
// list() returns an array of Statistic entities, one per record (throws on error).
$statistics = $client->Statistic()->list();
```

## Features

This SDK ships 4 optional features. Each is **inactive until you
switch it on**, so an SDK you have not configured behaves exactly as if none of
them existed — no retries, no cache, no logging, no measurable overhead.

Activate a feature by name in the client options, alongside the options shown
above:

| Feature | What it does |
|---|---|
| [`ratelimit`](#ratelimit) | Rate limiting |
| [`retry`](#retry) | Retry |
| [`test`](#test) | Test transport |
| [`timeout`](#timeout) | Timeout |

> **Order matters for `ratelimit`, `retry`, `timeout`.** These wrap the
> transport, so each one wraps whatever is already installed: the order you
> activate them in IS the nesting order. Activating them as an ordered list
> rather than a map is what fixes that order.

### ratelimit

Rate limiting.

| Option | Default |
|---|---|
| `active` | `false` |
| `burst` | `5` |
| `rate` | `5` |

Set `feature.ratelimit.active` to enable it, then override any of the options above.

`ratelimit` wraps the transport, so its position among the other
transport features decides what it sees. A feature activated later wraps one
activated earlier.

### retry

Retry.

| Option | Default |
|---|---|
| `active` | `false` |
| `factor` | `2` |
| `maxDelay` | `2000` |
| `minDelay` | `50` |
| `retries` | `2` |
| `statuses` | `[408, 425, 429, 500, 502, 503, 504]` |

Set `feature.retry.active` to enable it, then override any of the options above.

`retry` wraps the transport, so its position among the other
transport features decides what it sees. A feature activated later wraps one
activated earlier.

### test

Test transport.

| Option | Default |
|---|---|
| `active` | `false` |

Set `feature.test.active` to enable it, then override any of the options above.

### timeout

Timeout.

| Option | Default |
|---|---|
| `active` | `false` |
| `ms` | `30000` |

Set `feature.timeout.active` to enable it, then override any of the options above.

`timeout` wraps the transport, so its position among the other
transport features decides what it sees. A feature activated later wraps one
activated earlier.


## Advanced

> The sections above cover everyday use. The material below explains the
> SDK's internals — useful when extending it with custom features, but not
> needed for normal use.

### The operation pipeline

Every entity operation follows a six-stage pipeline. Each stage fires a
feature hook before executing:

```
PrePoint → PreSpec → PreRequest → PreResponse → PreResult → PreDone
```

- **PrePoint**: Resolves which API endpoint to call based on the
  operation name and entity configuration.
- **PreSpec**: Builds the HTTP spec — URL, method, headers, body —
  from the resolved point and the caller's parameters.
- **PreRequest**: Sends the HTTP request. Features can intercept here
  to replace the transport (as TestFeature does with mocks).
- **PreResponse**: Parses the raw HTTP response.
- **PreResult**: Extracts the business data from the parsed response.
- **PreDone**: Final stage before returning to the caller. Entity
  state (match, data) is updated here.

If any stage errors, the pipeline short-circuits and the error surfaces
to the caller — see [Error handling](#error-handling) for how that looks
in this language.

### Features and hooks

Features are the extension mechanism. A feature is a PHP class
with hook methods named after pipeline stages (e.g. `PrePoint`,
`PreSpec`). Each method receives the context.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as arrays

The PHP SDK uses plain PHP associative arrays throughout rather than typed
objects. This mirrors the dynamic nature of the API and keeps the
SDK flexible — no code generation is needed when the API schema
changes.

Use `Helpers::to_map()` to safely validate that a value is an array.

### Directory structure

```
php/
├── statorigin_sdk.php          -- Main SDK class
├── config.php                     -- Configuration
├── schema.php                     -- Generated option + entity specs
├── features.php                   -- Feature factory
├── core/                          -- Core types and context
├── entity/                        -- Entity implementations
├── feature/                       -- Built-in features (Base, Test, Log)
├── utility/                       -- Utility functions and struct library
└── test/                          -- Test suites
```

The main class (`statorigin_sdk.php`) exports the SDK class
and test helper. Import entity or utility modules directly only
when needed.

### Entity state

Entity instances are stateful. After a successful `list`, the entity
stores the returned data and match criteria internally.

```php
$industry = $client->Industry();
$industry->list();

// $industry->data_get() now returns the industry data from the last list
// $industry->match_get() returns the last match criteria
```

Call `make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

`direct()` gives full control over the HTTP request. Use it for
non-standard endpoints, bulk operations, or any path not modelled as
an entity. `prepare()` builds the request without sending it — useful
for debugging or custom transport.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
