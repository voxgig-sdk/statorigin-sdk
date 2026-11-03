# Statorigin Lua SDK



The Lua SDK for the Statorigin API — an entity-oriented client using Lua conventions.

It exposes the API as capitalised, semantic **Entities** — e.g. `client:Indicator()` — each with the same small set of operations (`list`, `load`) instead of raw URL paths and query strings. You call meaning, not endpoints, which keeps the cognitive load low.

> Other languages, the CLI, and MCP server live alongside this one — see
> the [top-level README](../README.md).


## Install
This package is not yet published to LuaRocks. Install it from the
GitHub release tag (`lua/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/statorigin-sdk/tags)),
or add the source directory to your `LUA_PATH`:

```bash
export LUA_PATH="path/to/lua/?.lua;path/to/lua/?/init.lua;;"
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```lua
local sdk = require("statorigin_sdk")

local client = sdk.new()
```

### 2. List indicator records

Entity operations return `(value, err)`. For `list`, `value` is an
array of entities, one per record — iterate it directly (there is no
wrapper), and read each record with `data_get()`.

```lua
local indicators, err = client:Indicator():list()
if err then error(err) end

for _, item in ipairs(indicators) do
  local rec = item:data_get()
  print(rec["slug"])
end
```

### 3. Load an indicator

`load` returns the entity; `data_get()` reads its record.

```lua
local indicator, err = client:Indicator():load({ id = "example_id" })
if err then error(err) end
local rec = indicator:data_get()
print(rec["slug"])
```


## Error handling

Entity operations return `(value, err)`. Check `err` before using
the value:

```lua
local industrys, err = client:Industry():list()
if err then error(err) end
```

`direct` follows the same `(value, err)` convention:

```lua
local result, err = client:direct({
  path = "/api/resource/{id}",
  method = "GET",
  params = { id = "example_id" },
})
if err then error(err) end
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```lua
local result, err = client:direct({
  path = "/api/resource/{id}",
  method = "GET",
  params = { id = "example" },
})
if err then error(err) end

if result["ok"] then
  print(result["status"])  -- 200
  print(result["data"])    -- response body
end
```

### Prepare a request without sending it

```lua
local fetchdef, err = client:prepare({
  path = "/api/resource/{id}",
  method = "DELETE",
  params = { id = "example" },
})
if err then error(err) end

print(fetchdef["url"])
print(fetchdef["method"])
print(fetchdef["headers"])
```

### Use test mode

Create a mock client for unit testing — no server required:

```lua
local client = sdk.test()

local result, err = client:Industry():list()
-- result is an array of entities, one per mock record; err is set on failure
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```lua
local function mock_fetch(url, init)
  return {
    status = 200,
    statusText = "OK",
    headers = {},
    json = function()
      return { id = "mock01" }
    end,
  }, nil
end

local client = sdk.new({
  base = "http://localhost:8080",
  system = {
    fetch = mock_fetch,
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
cd lua && busted test/
```


## Reference

### StatoriginSDK

```lua
local sdk = require("statorigin_sdk")
local client = sdk.new(options)
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `table` | Feature activation flags. |
| `extend` | `table` | Additional Feature instances to load. |
| `system` | `table` | System overrides (e.g. custom `fetch` function). |

### test

```lua
local client = sdk.test(testopts, sdkopts)
```

Creates a test-mode client with mock transport. Both arguments may be `nil`.

### StatoriginSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `options_map` | `() -> table` | Deep copy of current SDK options. |
| `get_utility` | `() -> Utility` | Copy of the SDK utility object. |
| `prepare` | `(fetchargs) -> table, err` | Build an HTTP request definition without sending. |
| `direct` | `(fetchargs) -> table, err` | Build and send an HTTP request. |
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
| `load` | `(reqmatch, ctrl) -> any, err` | Load a single entity by match criteria, and return it. |
| `list` | `(reqmatch, ctrl) -> any, err` | List entities matching the criteria, one per record. |
| `data_get` | `() -> table` | Get entity data. |
| `data_set` | `(data)` | Set entity data. |
| `match_get` | `() -> table` | Get entity match criteria. |
| `match_set` | `(match)` | Set entity match criteria. |
| `make` | `() -> Entity` | Create a new instance with the same options. |
| `get_name` | `() -> string` | Return the entity name. |

### Result shape

Entity operations return `(value, err)`. The `value` is the entity
itself — there is no wrapper:

| Operation | `value` |
| --- | --- |
| `load` | the entity, whose `data_get()` reads its record (a `table`) |
| `list` | an array (`table`) of entities, one per record |

Check `err` first (it is non-`nil` on failure), then use `value`:

    local indicator, err = client:Indicator():load({ id = "example_id" })
    if err then error(err) end
    -- indicator is the loaded entity

Only `direct()` returns a response envelope — a `table` with `ok`,
`status`, `headers`, and `data` keys.

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

Create an instance: `local indicator = client:Indicator(nil)`

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

```lua
local indicator, err = client:Indicator():load({ id = "indicator_id" })
```

#### Example: List

```lua
local indicators, err = client:Indicator():list()
```


### Industry

Create an instance: `local industry = client:Industry(nil)`

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
| `level` | `number` |  |
| `name` | `string` |  |
| `parent_id` | `string` |  |
| `slug` | `string` | URL key: the item routes take this. |

#### Example: Load

```lua
local industry, err = client:Industry():load({ id = "industry_id" })
```

#### Example: List

```lua
local industrys, err = client:Industry():list()
```


### Region

Create an instance: `local region = client:Region(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `data` | `table` |  |
| `meta` | `table` |  |

#### Example: List

```lua
local regions, err = client:Region():list()
```


### Search

Create an instance: `local search = client:Search(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Example: Load

```lua
local search, err = client:Search():load({ q = "q" })
```


### Source

Create an instance: `local source = client:Source(nil)`

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
| `tier` | `number` |  |
| `type` | `string` |  |

#### Example: Load

```lua
local source, err = client:Source():load({ id = "source_id" })
```

#### Example: List

```lua
local sources, err = client:Source():list()
```


### Statistic

Create an instance: `local statistic = client:Statistic(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `citation` | `table` |  |
| `confidence` | `number|nil` |  |
| `currency` | `string|nil` |  |
| `id` | `string` |  |
| `indicator` | `table` |  |
| `industry` | `table` |  |
| `is_current` | `boolean` | False once superseded_by is set |
| `is_secondhand` | `boolean` | True when the figure was relayed from a secondary source |
| `period` | `table` |  |
| `region` | `table` |  |
| `scale` | `string` |  |
| `source` | `table` | Complete provenance. |
| `superseded_by` | `string|nil` | Id of the newer record that corrected this one. |
| `supersedes` | `string|nil` | Id of the older record this one corrected, if any |
| `unit` | `string` |  |
| `updated_at` | `string` |  |
| `url` | `string` |  |
| `value` | `number` |  |
| `value_text` | `string|nil` | The source's own phrasing, preserved verbatim |
| `value_type` | `string` |  |
| `verification` | `string` |  |
| `verified_at` | `string|nil` |  |
| `verified_by` | `string|nil` |  |

#### Example: Load

```lua
local statistic, err = client:Statistic():load({ id = "statistic_id" })
```

#### Example: List

```lua
local statistics, err = client:Statistic():list()
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

Features are the extension mechanism. A feature is a Lua table
with hook methods named after pipeline stages (e.g. `PrePoint`,
`PreSpec`). Each method receives the context.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as tables

The Lua SDK uses plain Lua tables throughout rather than typed
objects. This mirrors the dynamic nature of the API and keeps the
SDK flexible — no code generation is needed when the API schema
changes.

Use `helpers.to_map()` to safely validate that a value is a table.

### Module structure

```
lua/
├── statorigin_sdk.lua    -- Main SDK module
├── config.lua               -- Configuration
├── schema.lua               -- Generated option + entity specs
├── features.lua             -- Feature factory
├── core/                    -- Core types and context
├── entity/                  -- Entity implementations
├── feature/                 -- Built-in features (Base, Test, Log)
├── utility/                 -- Utility functions and struct library
└── test/                    -- Test suites
```

The main module (`statorigin_sdk`) exports the SDK constructor
and test helper. Import entity or utility modules directly only
when needed.

### Entity state

Entity instances are stateful. After a successful `list`, the entity
stores the returned data and match criteria internally.

```lua
local industry = client:Industry()
industry:list()

-- industry:data_get() now returns the industry data from the last list
-- industry:match_get() returns the last match criteria
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
