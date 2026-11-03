# Statorigin Python SDK Reference

Complete API reference for the Statorigin Python SDK.


## StatoriginSDK

### Constructor

```python
from statorigin_sdk import StatoriginSDK

client = StatoriginSDK(options)
```

Create a new SDK client instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `options` | `dict` | SDK configuration options. |
| `options["base"]` | `str` | Base URL for API requests. |
| `options["prefix"]` | `str` | URL prefix appended after base. |
| `options["suffix"]` | `str` | URL suffix appended after path. |
| `options["headers"]` | `dict` | Custom headers for all requests. |
| `options["feature"]` | `dict` | Feature configuration. |
| `options["system"]` | `dict` | System overrides (e.g. custom fetch). |


### Static Methods

#### `StatoriginSDK.test(testopts=None, sdkopts=None)`

Create a test client with mock features active. Both arguments may be `None`.

```python
client = StatoriginSDK.test()
```


### Instance Methods

#### `Indicator(data=None)`

Create a new `IndicatorEntity` instance. Pass `None` for no initial data.

#### `Industry(data=None)`

Create a new `IndustryEntity` instance. Pass `None` for no initial data.

#### `Region(data=None)`

Create a new `RegionEntity` instance. Pass `None` for no initial data.

#### `Search(data=None)`

Create a new `SearchEntity` instance. Pass `None` for no initial data.

#### `Source(data=None)`

Create a new `SourceEntity` instance. Pass `None` for no initial data.

#### `Statistic(data=None)`

Create a new `StatisticEntity` instance. Pass `None` for no initial data.

#### `options_map() -> dict`

Return a deep copy of the current SDK options.

#### `get_utility() -> Utility`

Return a copy of the SDK utility object.

#### `direct(fetchargs=None) -> dict`

Make a direct HTTP request to any API endpoint. Returns a result `dict` with `ok`, `status`, `headers`, and `data` (or `err` on failure). This escape hatch never raises — branch on `result["ok"]`.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `fetchargs["path"]` | `str` | URL path with optional `{param}` placeholders. |
| `fetchargs["method"]` | `str` | HTTP method (default: `"GET"`). |
| `fetchargs["params"]` | `dict` | Path parameter values. |
| `fetchargs["query"]` | `dict` | Query string parameters. |
| `fetchargs["headers"]` | `dict` | Request headers (merged with defaults). |
| `fetchargs["body"]` | `any` | Request body (dicts are JSON-serialized). |

**Returns:** `result_dict`

#### `prepare(fetchargs=None) -> dict`

Prepare a fetch definition without sending. Returns the `fetchdef` and raises on error.


---

## IndicatorEntity

```python
indicator = client.Indicator()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `definition` | `str` | No |  |
| `id` | `str` | No | Stable prefixed identifier. |
| `name` | `str` | No |  |
| `slug` | `str` | No | URL key: the item routes take this. |
| `unit` | `str` | No |  |

### Operations

#### `list(reqmatch=None, ctrl=None) -> list[IndicatorEntity]`

List entities matching the given criteria. The match is optional — call `list()` with no argument to list all records. Returns a list of entities, one per record, and raises on error.

```python
results = client.Indicator().list()
for indicator in results:
    print(indicator.data_get())
```

#### `load(reqmatch, ctrl=None) -> IndicatorEntity`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get()` reads, and raises on error.

```python
result = client.Indicator().load({"id": "indicator_id"})
```

### Common Methods

#### `data_get() -> dict`

Get the entity data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> dict`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `IndicatorEntity` instance with the same options.

#### `get_name() -> str`

Return the entity name.


---

## IndustryEntity

```python
industry = client.Industry()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `str` | No | Stable prefixed identifier. |
| `isic` | `str` | No |  |
| `level` | `int` | No |  |
| `name` | `str` | No |  |
| `parent_id` | `str` | No |  |
| `slug` | `str` | No | URL key: the item routes take this. |

### Operations

#### `list(reqmatch=None, ctrl=None) -> list[IndustryEntity]`

List entities matching the given criteria. The match is optional — call `list()` with no argument to list all records. Returns a list of entities, one per record, and raises on error.

```python
results = client.Industry().list()
for industry in results:
    print(industry.data_get())
```

#### `load(reqmatch, ctrl=None) -> IndustryEntity`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get()` reads, and raises on error.

```python
result = client.Industry().load({"id": "industry_id"})
```

### Common Methods

#### `data_get() -> dict`

Get the entity data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> dict`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `IndustryEntity` instance with the same options.

#### `get_name() -> str`

Return the entity name.


---

## RegionEntity

```python
region = client.Region()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | `list` | No |  |
| `meta` | `dict` | No |  |

### Operations

#### `list(reqmatch=None, ctrl=None) -> list[RegionEntity]`

List entities matching the given criteria. The match is optional — call `list()` with no argument to list all records. Returns a list of entities, one per record, and raises on error.

```python
results = client.Region().list()
for region in results:
    print(region.data_get())
```

### Common Methods

#### `data_get() -> dict`

Get the entity data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> dict`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `RegionEntity` instance with the same options.

#### `get_name() -> str`

Return the entity name.


---

## SearchEntity

```python
search = client.Search()
```

### Operations

#### `load(reqmatch, ctrl=None) -> SearchEntity`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get()` reads, and raises on error.

```python
result = client.Search().load({"q": "q"})
```

### Common Methods

#### `data_get() -> dict`

Get the entity data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> dict`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `SearchEntity` instance with the same options.

#### `get_name() -> str`

Return the entity name.


---

## SourceEntity

```python
source = client.Source()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `str` | No | Stable prefixed identifier. |
| `name` | `str` | No |  |
| `short_name` | `str` | No |  |
| `slug` | `str` | No | URL key: the item routes take this. |
| `tier` | `int` | No |  |
| `type` | `str` | No |  |

### Operations

#### `list(reqmatch=None, ctrl=None) -> list[SourceEntity]`

List entities matching the given criteria. The match is optional — call `list()` with no argument to list all records. Returns a list of entities, one per record, and raises on error.

```python
results = client.Source().list()
for source in results:
    print(source.data_get())
```

#### `load(reqmatch, ctrl=None) -> SourceEntity`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get()` reads, and raises on error.

```python
result = client.Source().load({"id": "source_id"})
```

### Common Methods

#### `data_get() -> dict`

Get the entity data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> dict`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `SourceEntity` instance with the same options.

#### `get_name() -> str`

Return the entity name.


---

## StatisticEntity

```python
statistic = client.Statistic()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `citation` | `dict` | Yes |  |
| `confidence` | `float | None` | No |  |
| `currency` | `str | None` | No |  |
| `id` | `str` | Yes |  |
| `indicator` | `dict` | Yes |  |
| `industry` | `list` | No |  |
| `is_current` | `bool` | No | False once superseded_by is set |
| `is_secondhand` | `bool` | No | True when the figure was relayed from a secondary source |
| `period` | `dict` | Yes |  |
| `region` | `dict` | Yes |  |
| `scale` | `str` | No |  |
| `source` | `dict` | Yes | Complete provenance. |
| `superseded_by` | `str | None` | No | Id of the newer record that corrected this one. |
| `supersedes` | `str | None` | No | Id of the older record this one corrected, if any |
| `unit` | `str` | Yes |  |
| `updated_at` | `str` | No |  |
| `url` | `str` | Yes |  |
| `value` | `float` | Yes |  |
| `value_text` | `str | None` | No | The source's own phrasing, preserved verbatim |
| `value_type` | `str` | No |  |
| `verification` | `str` | No |  |
| `verified_at` | `str | None` | No |  |
| `verified_by` | `str | None` | No |  |

### Operations

#### `list(reqmatch=None, ctrl=None) -> list[StatisticEntity]`

List entities matching the given criteria. The match is optional — call `list()` with no argument to list all records. Returns a list of entities, one per record, and raises on error.

```python
results = client.Statistic().list()
for statistic in results:
    print(statistic.data_get())
```

#### `load(reqmatch, ctrl=None) -> StatisticEntity`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get()` reads, and raises on error.

```python
result = client.Statistic().load({"id": "statistic_id"})
```

### Common Methods

#### `data_get() -> dict`

Get the entity data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> dict`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `StatisticEntity` instance with the same options.

#### `get_name() -> str`

Return the entity name.


---

## Features

| Feature | Version | Description |
| --- | --- | --- |
| `ratelimit` | 0.0.1 | Rate limiting |
| `retry` | 0.0.1 | Retry |
| `test` | 0.0.1 | Test transport |
| `timeout` | 0.0.1 | Timeout |


Features are activated via the `feature` option:

```python
client = StatoriginSDK({
    "feature": {
        "ratelimit": {"active": True},
        "retry": {"active": True},
        "test": {"active": True},
        "timeout": {"active": True},
    },
})
```


### Configuring features

Each feature is inactive until switched on, and an SDK with no feature
configured does no feature work at all. Every option below keeps its default
unless you name it.

The array form of \`feature\` is significant: several features wrap the
transport, and the order you list them in is the order they nest.

#### Ordering

`ratelimit`, `retry`, `timeout` wrap the transport. Each
wraps whatever is already installed, so **activation order is nesting order**:
a feature activated later sits OUTSIDE one activated earlier, and sees the call
first.

That decides behaviour, not just sequence: a feature that short-circuits the
call, such as a cache serving a hit, stops every feature nested inside it from
ever seeing that call.

`test` attach to pipeline hooks
rather than the transport, so their order does not affect what they observe.

#### `ratelimit`

Rate limiting.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |
| `burst` | `5` |
| `rate` | `5` |

| Option | Type |
|---|---|
| `now` | function |
| `sleep` | function |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.ratelimit.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Wraps the transport: its place in the activation order decides what it
  sees. See [Ordering](#ordering) above.
- Inactive by default: leaving it out costs nothing at runtime.

#### `retry`

Retry.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |
| `factor` | `2` |
| `maxDelay` | `2000` |
| `minDelay` | `50` |
| `retries` | `2` |
| `statuses` | `[408, 425, 429, 500, 502, 503, 504]` |

| Option | Type |
|---|---|
| `jitter` | boolean |
| `sleep` | function |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.retry.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Wraps the transport: its place in the activation order decides what it
  sees. See [Ordering](#ordering) above.
- Inactive by default: leaving it out costs nothing at runtime.

#### `test`

Test transport.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |

| Option | Type |
|---|---|
| `entity` | map |
| `net` | map |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.test.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Attaches to pipeline hooks, not the transport, so activation order does
  not change what it observes.
- Installs the BASE transport that the wrapping features wrap, so it must be
  activated before them.
- Inactive by default: leaving it out costs nothing at runtime.

#### `timeout`

Timeout.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |
| `ms` | `30000` |

| Option | Type |
|---|---|
| `clearTimer` | function |
| `now` | function |
| `setTimer` | function |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.timeout.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Wraps the transport: its place in the activation order decides what it
  sees. See [Ordering](#ordering) above.
- Inactive by default: leaving it out costs nothing at runtime.

