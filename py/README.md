# Statorigin Python SDK



The Python SDK for the Statorigin API — an entity-oriented client following Pythonic conventions.

The SDK exposes the API as capitalised, semantic **Entities** — for example `client.Indicator()` — each
carrying a small, uniform set of operations (`list`, `load`) instead of raw URL
paths and query strings. You work with named resources and verbs, which
keeps the cognitive load low.

> Other languages, the CLI, and MCP server live alongside this one — see
> the [top-level README](../README.md).


## Install
This package is not yet published to PyPI. Install it from the GitHub
release tag (`py/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/statorigin-sdk/tags)) or
from a source checkout:

```bash
pip install -e .
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```python
from statorigin_sdk import StatoriginSDK

client = StatoriginSDK()
```

### 2. List indicator records

`list()` returns a `list` of entities, one per record, and raises on
error; an entity's `data_get()` reads its record (a `dict`).

```python
try:
    indicators = client.Indicator().list()
    for indicator in indicators:
        print(indicator.data_get())
except Exception as err:
    print(f"list failed: {err}")
```

### 3. Load an indicator

`load()` returns the ENTITY — call data_get() for the record — and raises on error.

```python
try:
    indicator = client.Indicator().load({"id": "example_id"})
    print(indicator.data_get())
except Exception as err:
    print(f"load failed: {err}")
```


## Error handling

Entity operations raise on failure, so wrap them in `try` / `except`:

```python
try:
    industrys = client.Industry().list()
    print([item.data_get() for item in industrys])
except Exception as err:
    print(f"list failed: {err}")
```

`direct()` does **not** raise — it returns the result envelope. Branch
on `ok`; on failure `status` holds the HTTP status (for error responses)
and `err` holds a transport error, so read both defensively:

```python
result = client.direct({
    "path": "/api/resource/{id}",
    "method": "GET",
    "params": {"id": "example_id"},
})

if not result["ok"]:
    print("request failed:", result.get("status"), result.get("err"))
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```python
result = client.direct({
    "path": "/api/resource/{id}",
    "method": "GET",
    "params": {"id": "example"},
})

if result["ok"]:
    print(result["status"])  # 200
    print(result["data"])    # response body
else:
    # A non-2xx response carries status + data (the error body); a
    # transport-level failure carries err instead. Only one is present, so
    # read both with .get() rather than indexing a key that may be absent.
    print(result.get("status"), result.get("err"))
```

### Prepare a request without sending it

```python
# prepare() returns the fetch definition and raises on error.
fetchdef = client.prepare({
    "path": "/api/resource/{id}",
    "method": "DELETE",
    "params": {"id": "example"},
})

print(fetchdef["url"])
print(fetchdef["method"])
print(fetchdef["headers"])
```

### Use test mode

Create a mock client for unit testing — no server required:

```python
client = StatoriginSDK.test()

# Entity ops return the entity, and list one per record; they raise on error.
industry = client.Industry().list()
# data_get() on an entity reads its mock response record
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```python
def mock_fetch(url, init):
    return {
        "status": 200,
        "statusText": "OK",
        "headers": {},
        "json": lambda: {"id": "mock01"},
    }, None

client = StatoriginSDK({
    "base": "http://localhost:8080",
    "system": {
        "fetch": mock_fetch,
    },
})
```

### Run live tests

Create a `.env.local` file at the project root:

```
STATORIGIN_TEST_LIVE=TRUE
```

Then run:

```bash
cd py && pytest test/
```


## Reference

### StatoriginSDK

```python
from statorigin_sdk import StatoriginSDK

client = StatoriginSDK(options)
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `base` | `str` | Base URL of the API server. |
| `prefix` | `str` | URL path prefix prepended to all requests. |
| `suffix` | `str` | URL path suffix appended to all requests. |
| `feature` | `dict` | Feature activation flags. |
| `extend` | `list` | Additional Feature instances to load. |
| `system` | `dict` | System overrides (e.g. custom `fetch` function). |

### test

```python
client = StatoriginSDK.test(testopts, sdkopts)
```

Creates a test-mode client with mock transport. Both arguments may be `None`.

### StatoriginSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `options_map` | `() -> dict` | Deep copy of current SDK options. |
| `get_utility` | `() -> Utility` | Copy of the SDK utility object. |
| `prepare` | `(fetchargs) -> dict` | Build an HTTP request definition without sending. Raises on error. |
| `direct` | `(fetchargs) -> dict` | Build and send an HTTP request. Returns a result dict (branch on `ok`). |
| `Indicator` | `(data) -> IndicatorEntity` | Create an Indicator entity instance. |
| `Industry` | `(data) -> IndustryEntity` | Create an Industry entity instance. |
| `Region` | `(data) -> RegionEntity` | Create a Region entity instance. |
| `Search` | `(data) -> SearchEntity` | Create a Search entity instance. |
| `Source` | `(data) -> SourceEntity` | Create a Source entity instance. |
| `Statistic` | `(data) -> StatisticEntity` | Create a Statistic entity instance. |

### Entity interface

All entities share the same interface.

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `(reqmatch, ctrl) -> any` | Load a single entity by match criteria, and return it. Raises on error. |
| `list` | `(reqmatch, ctrl) -> list` | List entities matching the criteria, one per record. Raises on error. |
| `data_get` | `() -> dict` | Get entity data. |
| `data_set` | `(data)` | Set entity data. |
| `match_get` | `() -> dict` | Get entity match criteria. |
| `match_set` | `(match)` | Set entity match criteria. |
| `make` | `() -> Entity` | Create a new instance with the same options. |
| `get_name` | `() -> str` | Return the entity name. |

### Result shape

Entity operations return the entity, and `list` a `list` of entities, one
per record; an entity's `data_get()` reads its record (a `dict`). They raise
on error, so wrap calls in `try`/`except` to handle failures.

The `direct()` escape hatch never raises — it returns a result `dict`
you branch on via `result["ok"]`:

| Key | Type | Description |
| --- | --- | --- |
| `ok` | `bool` | `True` if the HTTP status is 2xx. |
| `status` | `int` | HTTP status code. |
| `headers` | `dict` | Response headers. |
| `data` | `any` | Parsed JSON response body. |

On error, `ok` is `False` and `err` contains the error value.

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

Create an instance: `indicator = client.Indicator()`

#### Operations

| Method | Description |
| --- | --- |
| `list()` | List entities, optionally matching the given criteria. |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `definition` | `str` |  |
| `id` | `str` | Stable prefixed identifier. |
| `name` | `str` |  |
| `slug` | `str` | URL key: the item routes take this. |
| `unit` | `str` |  |

#### Example: Load

```python
indicator = client.Indicator().load({"id": "indicator_id"})
```

#### Example: List

```python
indicators = client.Indicator().list()
```


### Industry

Create an instance: `industry = client.Industry()`

#### Operations

| Method | Description |
| --- | --- |
| `list()` | List entities, optionally matching the given criteria. |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | `str` | Stable prefixed identifier. |
| `isic` | `str` |  |
| `level` | `int` |  |
| `name` | `str` |  |
| `parent_id` | `str` |  |
| `slug` | `str` | URL key: the item routes take this. |

#### Example: Load

```python
industry = client.Industry().load({"id": "industry_id"})
```

#### Example: List

```python
industrys = client.Industry().list()
```


### Region

Create an instance: `region = client.Region()`

#### Operations

| Method | Description |
| --- | --- |
| `list()` | List entities, optionally matching the given criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `data` | `list` |  |
| `meta` | `dict` |  |

#### Example: List

```python
regions = client.Region().list()
```


### Search

Create an instance: `search = client.Search()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Example: Load

```python
search = client.Search().load({"q": "q"})
```


### Source

Create an instance: `source = client.Source()`

#### Operations

| Method | Description |
| --- | --- |
| `list()` | List entities, optionally matching the given criteria. |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | `str` | Stable prefixed identifier. |
| `name` | `str` |  |
| `short_name` | `str` |  |
| `slug` | `str` | URL key: the item routes take this. |
| `tier` | `int` |  |
| `type` | `str` |  |

#### Example: Load

```python
source = client.Source().load({"id": "source_id"})
```

#### Example: List

```python
sources = client.Source().list()
```


### Statistic

Create an instance: `statistic = client.Statistic()`

#### Operations

| Method | Description |
| --- | --- |
| `list()` | List entities, optionally matching the given criteria. |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `citation` | `dict` |  |
| `confidence` | `float | None` |  |
| `currency` | `str | None` |  |
| `id` | `str` |  |
| `indicator` | `dict` |  |
| `industry` | `list` |  |
| `is_current` | `bool` | False once superseded_by is set |
| `is_secondhand` | `bool` | True when the figure was relayed from a secondary source |
| `period` | `dict` |  |
| `region` | `dict` |  |
| `scale` | `str` |  |
| `source` | `dict` | Complete provenance. |
| `superseded_by` | `str | None` | Id of the newer record that corrected this one. |
| `supersedes` | `str | None` | Id of the older record this one corrected, if any |
| `unit` | `str` |  |
| `updated_at` | `str` |  |
| `url` | `str` |  |
| `value` | `float` |  |
| `value_text` | `str | None` | The source's own phrasing, preserved verbatim |
| `value_type` | `str` |  |
| `verification` | `str` |  |
| `verified_at` | `str | None` |  |
| `verified_by` | `str | None` |  |

#### Example: Load

```python
statistic = client.Statistic().load({"id": "statistic_id"})
```

#### Example: List

```python
statistics = client.Statistic().list()
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

Features are the extension mechanism. A feature is a Python class
with hook methods named after pipeline stages (e.g. `PrePoint`,
`PreSpec`). Each method receives the context.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as dicts

The Python SDK uses plain dicts throughout rather than typed
objects. This mirrors the dynamic nature of the API and keeps the
SDK flexible — no code generation is needed when the API schema
changes.

Use `helpers.to_map()` to safely validate that a value is a dict.

### Module structure

```
py/
├── statorigin_sdk.py         -- Main SDK module
├── config.py                    -- Configuration
├── schema.py                    -- Generated option + entity specs
├── features.py                  -- Feature factory
├── core/                        -- Core types and context
├── entity/                      -- Entity implementations
├── feature/                     -- Built-in features (Base, Test, Log)
├── utility/                     -- Utility functions and struct library
└── test/                        -- Test suites
```

The main module (`statorigin_sdk`) exports the SDK class.
Import entity or utility modules directly only when needed.

### Entity state

Entity instances are stateful. After a successful `list`, the entity
stores the returned data and match criteria internally.

```python
industry = client.Industry()
industry.list()

# industry.data_get() now returns the industry data from the last list
# industry.match_get() returns the last match criteria
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
