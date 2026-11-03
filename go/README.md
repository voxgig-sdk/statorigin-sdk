# Statorigin Golang SDK



The Golang SDK for the Statorigin API — an entity-oriented client using standard Go conventions. No generics required; data flows as `map[string]any`.

It exposes the API as capitalised, semantic **Entities** — e.g. `client.Indicator(nil)` — each with the same small set of operations (`List`, `Load`) instead of raw URL paths and query strings. You call meaning, not endpoints, which keeps the cognitive load low.

> Also generated from this model: `go-cli`, `go-mcp`, `lua`, `php`, `py`, `rb`, `ts` — see
> the [top-level README](../README.md).


## Install
```bash
go get github.com/voxgig-sdk/statorigin-sdk/go@latest
```

The Go module proxy resolves the version from the `go/vX.Y.Z` GitHub
release tag — see [Tags](https://github.com/voxgig-sdk/statorigin-sdk/tags) for the available versions.

To vendor from a local checkout instead, clone this repo alongside your
project and add a `replace` directive pointing at the checked-out
`go/` directory:

```bash
go mod edit -replace github.com/voxgig-sdk/statorigin-sdk/go=../statorigin-sdk/go
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### Quickstart

A complete program: create a client, then call the entity operations.
Each operation returns `(value, error)` — the value is the entity, and for
`List` a `[]any` of entities, one per record (there is no `{ok, data}`
wrapper), so check `err` and read a record through the entity's
`Data()`.

```go
package main

import (
    "fmt"
    sdk "github.com/voxgig-sdk/statorigin-sdk/go"
)

func main() {
    client := sdk.New()

    // List indicator records — the value is a []any of entities, one per record.
    indicators, err := client.Indicator(nil).List(nil, nil)
    if err != nil {
        panic(err)
    }
    for _, item := range indicators.([]any) {
        fmt.Println(item.(sdk.Entity).Data())
    }

    // Load a single indicator — the value is the entity; Data() reads its record.
    indicator, err := client.Indicator(nil).Load(map[string]any{"id": "example_id"}, nil)
    if err != nil {
        panic(err)
    }
    fmt.Println(indicator.(sdk.Entity).Data())
}
```


## Error handling

Every entity operation returns `(value, error)`. Check `err` before
using the value — there is no exception to catch:

```go
industrys, err := client.Industry(nil).List(nil, nil)
if err != nil {
    // handle err
    return
}
_ = industrys
```

`Direct` follows the same `(value, error)` convention:

```go
result, err := client.Direct(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "GET",
    "params": map[string]any{"id": "example_id"},
})
if err != nil {
    // handle err
}
_ = result
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```go
result, err := client.Direct(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "GET",
    "params": map[string]any{"id": "example"},
})
if err != nil {
    panic(err)
}

if result["ok"] == true {
    fmt.Println(result["status"]) // 200
    fmt.Println(result["data"])   // response body
}
```

### Prepare a request without sending it

```go
fetchdef, err := client.Prepare(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "DELETE",
    "params": map[string]any{"id": "example"},
})
if err != nil {
    panic(err)
}

fmt.Println(fetchdef["url"])
fmt.Println(fetchdef["method"])
fmt.Println(fetchdef["headers"])
```

### Use test mode

Create a mock client for unit testing — no server required:

```go
client := sdk.Test()

industrys, err := client.Industry(nil).List(
    nil, nil,
)
if err != nil {
    panic(err)
}
// A []any of entities, one per mock record.
for _, item := range industrys.([]any) {
    fmt.Println(item.(sdk.Entity).Data())
}
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```go
mockFetch := func(url string, init map[string]any) (map[string]any, error) {
    return map[string]any{
        "status":     200,
        "statusText": "OK",
        "headers":    map[string]any{},
        "json": (func() any)(func() any {
            return map[string]any{"id": "mock01"}
        }),
    }, nil
}

client := sdk.NewStatoriginSDK(map[string]any{
    "base": "http://localhost:8080",
    "system": map[string]any{
        "fetch": (func(string, map[string]any) (map[string]any, error))(mockFetch),
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
cd go && go test ./test/...
```


## Reference

### NewStatoriginSDK

```go
func NewStatoriginSDK(options map[string]any) *StatoriginSDK
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `"base"` | `string` | Base URL of the API server. |
| `"prefix"` | `string` | URL path prefix prepended to all requests. |
| `"suffix"` | `string` | URL path suffix appended to all requests. |
| `"feature"` | `map[string]any` | Feature activation flags. |
| `"extend"` | `[]any` | Additional Feature instances to load. |
| `"system"` | `map[string]any` | System overrides (e.g. custom `"fetch"` function). |

### TestSDK

```go
func TestSDK(testopts map[string]any, sdkopts map[string]any) *StatoriginSDK
```

Creates a test-mode client with mock transport. Both arguments may be `nil`.

### StatoriginSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `OptionsMap` | `() map[string]any` | Deep copy of current SDK options. |
| `GetUtility` | `() *Utility` | Copy of the SDK utility object. |
| `Prepare` | `(fetchargs map[string]any) (map[string]any, error)` | Build an HTTP request definition without sending. |
| `Direct` | `(fetchargs map[string]any) (map[string]any, error)` | Build and send an HTTP request. |
| `Indicator` | `(data map[string]any) StatoriginEntityBase` | Create an Indicator entity instance. |
| `Industry` | `(data map[string]any) StatoriginEntityBase` | Create an Industry entity instance. |
| `Region` | `(data map[string]any) StatoriginEntityBase` | Create a Region entity instance. |
| `Search` | `(data map[string]any) StatoriginEntityBase` | Create a Search entity instance. |
| `Source` | `(data map[string]any) StatoriginEntityBase` | Create a Source entity instance. |
| `Statistic` | `(data map[string]any) StatoriginEntityBase` | Create a Statistic entity instance. |

### Entity interface (StatoriginEntityBase)

All entities implement the `StatoriginEntityBase` interface.

| Method | Signature | Description |
| --- | --- | --- |
| `Load` | `(reqmatch, ctrl map[string]any) (any, error)` | Load a single entity by match criteria, and return it. |
| `List` | `(reqmatch, ctrl map[string]any) (any, error)` | List entities matching the criteria, one per record. |
| `Data` | `(args ...any) any` | Get or set entity data. |
| `Match` | `(args ...any) any` | Get or set entity match criteria. |
| `Make` | `() Entity` | Create a new instance with the same options. |
| `GetName` | `() string` | Return the entity name. |

### Result shape

Entity operations return `(value, error)`. The `value` is the entity
itself — there is no wrapper:

| Operation | `value` |
| --- | --- |
| `Load` | the entity, whose `Data()` reads its record (`map[string]any`) |
| `List` | a `[]any` of entities, one per record |

Check `err` first, then use the value directly (or the typed
`...Typed` variants, which return the entity's model struct and a typed
slice):

    indicator, err := client.Indicator(nil).List(nil, nil)
    if err != nil { /* handle */ }
    // indicator is a []any of entities, one per record

Only `Direct()` returns a response envelope — a `map[string]any` with
`"ok"`, `"status"`, `"headers"`, and `"data"` keys.

### Entities

#### Indicator

| Field | Description |
| --- | --- |
| `"definition"` |  |
| `"id"` | Stable prefixed identifier. |
| `"name"` |  |
| `"slug"` | URL key: the item routes take this. |
| `"unit"` |  |

Operations: List, Load.

API path: `/indicators`

#### Industry

| Field | Description |
| --- | --- |
| `"id"` | Stable prefixed identifier. |
| `"isic"` |  |
| `"level"` |  |
| `"name"` |  |
| `"parent_id"` |  |
| `"slug"` | URL key: the item routes take this. |

Operations: List, Load.

API path: `/industries`

#### Region

| Field | Description |
| --- | --- |
| `"data"` |  |
| `"meta"` |  |

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
| `"id"` | Stable prefixed identifier. |
| `"name"` |  |
| `"short_name"` |  |
| `"slug"` | URL key: the item routes take this. |
| `"tier"` |  |
| `"type"` |  |

Operations: List, Load.

API path: `/sources`

#### Statistic

| Field | Description |
| --- | --- |
| `"citation"` |  |
| `"confidence"` |  |
| `"currency"` |  |
| `"id"` |  |
| `"indicator"` |  |
| `"industry"` |  |
| `"is_current"` | False once superseded_by is set |
| `"is_secondhand"` | True when the figure was relayed from a secondary source |
| `"period"` |  |
| `"region"` |  |
| `"scale"` |  |
| `"source"` | Complete provenance. |
| `"superseded_by"` | Id of the newer record that corrected this one. |
| `"supersedes"` | Id of the older record this one corrected, if any |
| `"unit"` |  |
| `"updated_at"` |  |
| `"url"` |  |
| `"value"` |  |
| `"value_text"` | The source's own phrasing, preserved verbatim |
| `"value_type"` |  |
| `"verification"` |  |
| `"verified_at"` |  |
| `"verified_by"` |  |

Operations: List, Load.

API path: `/statistics`



## Entities


### Indicator

Create an instance: `indicator := client.Indicator(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `List(match, ctrl)` | List entities matching the criteria. |
| `Load(match, ctrl)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `definition` | `string` |  |
| `id` | `string` | Stable prefixed identifier. |
| `name` | `string` |  |
| `slug` | `string` | URL key: the item routes take this. |
| `unit` | `string` |  |

#### Example: Load

```go
indicator, err := client.Indicator(nil).Load(map[string]any{"id": "indicator_id"}, nil)
if err != nil {
    panic(err)
}
fmt.Println(indicator.(sdk.Entity).Data()) // the loaded entity's record
```

#### Example: List

```go
indicators, err := client.Indicator(nil).List(nil, nil)
if err != nil {
    panic(err)
}
// A []any of entities, one per record.
for _, item := range indicators.([]any) {
    fmt.Println(item.(sdk.Entity).Data())
}
```


### Industry

Create an instance: `industry := client.Industry(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `List(match, ctrl)` | List entities matching the criteria. |
| `Load(match, ctrl)` | Load a single entity by match criteria. |

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

```go
industry, err := client.Industry(nil).Load(map[string]any{"id": "industry_id"}, nil)
if err != nil {
    panic(err)
}
fmt.Println(industry.(sdk.Entity).Data()) // the loaded entity's record
```

#### Example: List

```go
industrys, err := client.Industry(nil).List(nil, nil)
if err != nil {
    panic(err)
}
// A []any of entities, one per record.
for _, item := range industrys.([]any) {
    fmt.Println(item.(sdk.Entity).Data())
}
```


### Region

Create an instance: `region := client.Region(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `List(match, ctrl)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `data` | `[]any` |  |
| `meta` | `map[string]any` |  |

#### Example: List

```go
regions, err := client.Region(nil).List(nil, nil)
if err != nil {
    panic(err)
}
// A []any of entities, one per record.
for _, item := range regions.([]any) {
    fmt.Println(item.(sdk.Entity).Data())
}
```


### Search

Create an instance: `search := client.Search(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `Load(match, ctrl)` | Load a single entity by match criteria. |

#### Example: Load

```go
search, err := client.Search(nil).Load(map[string]any{"q": "q"}, nil)
if err != nil {
    panic(err)
}
fmt.Println(search.(sdk.Entity).Data()) // the loaded entity's record
```


### Source

Create an instance: `source := client.Source(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `List(match, ctrl)` | List entities matching the criteria. |
| `Load(match, ctrl)` | Load a single entity by match criteria. |

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

```go
source, err := client.Source(nil).Load(map[string]any{"id": "source_id"}, nil)
if err != nil {
    panic(err)
}
fmt.Println(source.(sdk.Entity).Data()) // the loaded entity's record
```

#### Example: List

```go
sources, err := client.Source(nil).List(nil, nil)
if err != nil {
    panic(err)
}
// A []any of entities, one per record.
for _, item := range sources.([]any) {
    fmt.Println(item.(sdk.Entity).Data())
}
```


### Statistic

Create an instance: `statistic := client.Statistic(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `List(match, ctrl)` | List entities matching the criteria. |
| `Load(match, ctrl)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `citation` | `map[string]any` |  |
| `confidence` | `any` |  |
| `currency` | `any` |  |
| `id` | `string` |  |
| `indicator` | `map[string]any` |  |
| `industry` | `[]any` |  |
| `is_current` | `bool` | False once superseded_by is set |
| `is_secondhand` | `bool` | True when the figure was relayed from a secondary source |
| `period` | `map[string]any` |  |
| `region` | `map[string]any` |  |
| `scale` | `string` |  |
| `source` | `map[string]any` | Complete provenance. |
| `superseded_by` | `any` | Id of the newer record that corrected this one. |
| `supersedes` | `any` | Id of the older record this one corrected, if any |
| `unit` | `string` |  |
| `updated_at` | `string` |  |
| `url` | `string` |  |
| `value` | `float64` |  |
| `value_text` | `any` | The source's own phrasing, preserved verbatim |
| `value_type` | `string` |  |
| `verification` | `string` |  |
| `verified_at` | `any` |  |
| `verified_by` | `any` |  |

#### Example: Load

```go
statistic, err := client.Statistic(nil).Load(map[string]any{"id": "statistic_id"}, nil)
if err != nil {
    panic(err)
}
fmt.Println(statistic.(sdk.Entity).Data()) // the loaded entity's record
```

#### Example: List

```go
statistics, err := client.Statistic(nil).List(nil, nil)
if err != nil {
    panic(err)
}
// A []any of entities, one per record.
for _, item := range statistics.([]any) {
    fmt.Println(item.(sdk.Entity).Data())
}
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

Features are the extension mechanism. A feature implements the
`Feature` interface and provides hooks — functions keyed by pipeline
stage names.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as maps

The Go SDK uses `map[string]any` throughout rather than typed structs.
This mirrors the dynamic nature of the API and keeps the SDK
flexible — no code generation is needed when the API schema changes.

An operation returns the entity, and its `Data()` returns the record. Use
`core.ToMapAny()` to safely cast that record, or data nested in it, to
`map[string]any`: it returns `nil` for anything else, an entity included.

### Package structure

```
github.com/voxgig-sdk/statorigin-sdk/go/
├── statorigin.go        # Root package — type aliases and constructors
├── core/               # SDK core — client, types, pipeline
├── entity/             # Entity implementations
├── feature/            # Built-in features (Base, Test, Log)
├── utility/            # Utility functions and struct library
└── test/               # Test suites
```

The root package (`github.com/voxgig-sdk/statorigin-sdk/go`) re-exports everything needed
for normal use. Import sub-packages only when you need specific types
like `core.ToMapAny`.

### Entity state

Entity instances are stateful. After a successful `List`, the entity
stores the returned data and match criteria internally.

```go
industry := client.Industry(nil)
industry.List(nil, nil)

// industry.Data() now returns the industry data from the last list
// industry.Match() returns the last match criteria
```

Call `Make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

`Direct()` gives full control over the HTTP request. Use it for
non-standard endpoints, bulk operations, or any path not modelled as
an entity. `Prepare()` builds the request without sending it — useful
for debugging or custom transport.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
