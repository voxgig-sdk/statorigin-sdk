# Statorigin TypeScript SDK Reference

Complete API reference for the Statorigin TypeScript SDK.


## StatoriginSDK

### Constructor

```ts
new StatoriginSDK(options?: object)
```

Create a new SDK client instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `options` | `object` | SDK configuration options. |
| `options.base` | `string` | Base URL for API requests. |
| `options.prefix` | `string` | URL prefix appended after base. |
| `options.suffix` | `string` | URL suffix appended after path. |
| `options.headers` | `object` | Custom headers for all requests. |
| `options.feature` | `object` | Feature configuration. |
| `options.system` | `object` | System overrides (e.g. custom fetch). |


### Static Methods

#### `StatoriginSDK.test(testopts?, sdkopts?)`

Create a test client with mock features active.

```ts
const client = StatoriginSDK.test()
```

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `testopts` | `object` | Test feature options. |
| `sdkopts` | `object` | Additional SDK options merged with test defaults. |

**Returns:** `StatoriginSDK` instance in test mode.


### Instance Methods

#### `Indicator(data?: object)`

Create a new `Indicator` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `IndicatorEntity` instance.

#### `Industry(data?: object)`

Create a new `Industry` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `IndustryEntity` instance.

#### `Region(data?: object)`

Create a new `Region` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `RegionEntity` instance.

#### `Search(data?: object)`

Create a new `Search` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `SearchEntity` instance.

#### `Source(data?: object)`

Create a new `Source` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `SourceEntity` instance.

#### `Statistic(data?: object)`

Create a new `Statistic` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `StatisticEntity` instance.

#### `options()`

Return a deep copy of the current SDK options.

**Returns:** `object`

#### `utility()`

Return a copy of the SDK utility object.

**Returns:** `object`

#### `direct(fetchargs?: object)`

Make a direct HTTP request to any API endpoint.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `fetchargs.path` | `string` | URL path with optional `{param}` placeholders. |
| `fetchargs.method` | `string` | HTTP method (default: `GET`). |
| `fetchargs.params` | `object` | Path parameter values for `{param}` substitution. |
| `fetchargs.query` | `object` | Query string parameters. |
| `fetchargs.headers` | `object` | Request headers (merged with defaults). |
| `fetchargs.body` | `any` | Request body (objects are JSON-serialized). |
| `fetchargs.ctrl` | `object` | Control options (e.g. `{ explain: true }`). |
| `fetchargs.ctrl.signal` | `AbortSignal` | Aborts the request in flight: `ok` is then `false` and `err.code` is `request_aborted`. |

**Returns:** `Promise<{ ok, status, headers, data }>`. On a failure
`ok` is `false` and `err` holds the error.

#### `prepare(fetchargs?: object)`

Prepare a fetch definition without sending the request. Accepts the
same parameters as `direct()`.

**Returns:** `Promise<{ url, method, headers, body } | Error>`

#### `tester(testopts?, sdkopts?)`

Alias for `StatoriginSDK.test()`.

**Returns:** `StatoriginSDK` instance in test mode.

#### Cancelling a call

Every entity operation takes an optional `ctrl` object after its match or
data, and an `AbortSignal` in `ctrl.signal` cancels the request in flight.
The operation then rejects with an error whose `code` is
`request_aborted` and whose `cause` is the signal's reason. A request
whose signal has already aborted is not sent. `stream()` takes the signal
as `callopts.signal`, and ends when it aborts.


---

## IndicatorEntity

```ts
const indicator = client.Indicator()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `definition` | `string` | No |  |
| `id` | `string` | No | Stable prefixed identifier. |
| `name` | `string` | No |  |
| `slug` | `string` | No | URL key: the item routes take this. |
| `unit` | `string` | No |  |

### Actions

This entity exposes custom API actions in addition to the standard
operations. Select one with `$action` in the call's argument; the
remaining keys are sent as that action's payload.

| Action | Route | Call |
| --- | --- | --- |
| `series` | `/indicators/{slug}/series` | `client.Indicator().load({ $action: 'series', ... })` |

An action returns that action's OWN response, which is not necessarily a
Indicator record — check the API definition for its shape.

```ts
const result = await client.Indicator().load({
  $action: 'series',
  /* ...the action's own arguments */
})
```

### Operations

#### `list(match: object, ctrl?: object)`

List entities matching the given criteria. Resolves to an array of entities, one per record.

```ts
const results = await client.Indicator().list()
```

#### `load(match: object, ctrl?: object)`

Load a single entity matching the given criteria. Resolves to the entity, whose record `data()` reads.

```ts
const result = await client.Indicator().load({ id: 'indicator_id' })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `IndicatorEntity` instance with the same client and
options.

#### `client()`

Return the parent `StatoriginSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## IndustryEntity

```ts
const industry = client.Industry()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | No | Stable prefixed identifier. |
| `isic` | `string` | No |  |
| `level` | `number` | No |  |
| `name` | `string` | No |  |
| `parent_id` | `string` | No |  |
| `slug` | `string` | No | URL key: the item routes take this. |

### Operations

#### `list(match: object, ctrl?: object)`

List entities matching the given criteria. Resolves to an array of entities, one per record.

```ts
const results = await client.Industry().list()
```

#### `load(match: object, ctrl?: object)`

Load a single entity matching the given criteria. Resolves to the entity, whose record `data()` reads.

```ts
const result = await client.Industry().load({ id: 'industry_id' })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `IndustryEntity` instance with the same client and
options.

#### `client()`

Return the parent `StatoriginSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## RegionEntity

```ts
const region = client.Region()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | `any[]` | No |  |
| `meta` | `Record<string, any>` | No |  |

### Operations

#### `list(match: object, ctrl?: object)`

List entities matching the given criteria. Resolves to an array of entities, one per record.

```ts
const results = await client.Region().list()
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `RegionEntity` instance with the same client and
options.

#### `client()`

Return the parent `StatoriginSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## SearchEntity

```ts
const search = client.Search()
```

### Operations

#### `load(match: object, ctrl?: object)`

Load a single entity matching the given criteria. Resolves to the entity, whose record `data()` reads.

```ts
const result = await client.Search().load({ q: 'q' })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `SearchEntity` instance with the same client and
options.

#### `client()`

Return the parent `StatoriginSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## SourceEntity

```ts
const source = client.Source()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | No | Stable prefixed identifier. |
| `name` | `string` | No |  |
| `short_name` | `string` | No |  |
| `slug` | `string` | No | URL key: the item routes take this. |
| `tier` | `number` | No |  |
| `type` | `string` | No |  |

### Operations

#### `list(match: object, ctrl?: object)`

List entities matching the given criteria. Resolves to an array of entities, one per record.

```ts
const results = await client.Source().list()
```

#### `load(match: object, ctrl?: object)`

Load a single entity matching the given criteria. Resolves to the entity, whose record `data()` reads.

```ts
const result = await client.Source().load({ id: 'source_id' })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `SourceEntity` instance with the same client and
options.

#### `client()`

Return the parent `StatoriginSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## StatisticEntity

```ts
const statistic = client.Statistic()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `citation` | `Record<string, any>` | Yes |  |
| `confidence` | `number | null` | No |  |
| `currency` | `string | null` | No |  |
| `id` | `string` | Yes |  |
| `indicator` | `Record<string, any>` | Yes |  |
| `industry` | `any[]` | No |  |
| `is_current` | `boolean` | No | False once superseded_by is set |
| `is_secondhand` | `boolean` | No | True when the figure was relayed from a secondary source |
| `period` | `Record<string, any>` | Yes |  |
| `region` | `Record<string, any>` | Yes |  |
| `scale` | `string` | No |  |
| `source` | `Record<string, any>` | Yes | Complete provenance. |
| `superseded_by` | `string | null` | No | Id of the newer record that corrected this one. |
| `supersedes` | `string | null` | No | Id of the older record this one corrected, if any |
| `unit` | `string` | Yes |  |
| `updated_at` | `string` | No |  |
| `url` | `string` | Yes |  |
| `value` | `number` | Yes |  |
| `value_text` | `string | null` | No | The source's own phrasing, preserved verbatim |
| `value_type` | `string` | No |  |
| `verification` | `string` | No |  |
| `verified_at` | `string | null` | No |  |
| `verified_by` | `string | null` | No |  |

### Operations

#### `list(match: object, ctrl?: object)`

List entities matching the given criteria. Resolves to an array of entities, one per record.

```ts
const results = await client.Statistic().list()
```

#### `load(match: object, ctrl?: object)`

Load a single entity matching the given criteria. Resolves to the entity, whose record `data()` reads.

```ts
const result = await client.Statistic().load({ id: 'statistic_id' })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `StatisticEntity` instance with the same client and
options.

#### `client()`

Return the parent `StatoriginSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## Features

| Feature | Version | Description |
| --- | --- | --- |
| `ratelimit` | 0.0.1 | Rate limiting |
| `retry` | 0.0.1 | Retry |
| `test` | 0.0.1 | Test transport |
| `timeout` | 0.0.1 | Timeout |


Features are activated via the `feature` option:

```ts
const client = new StatoriginSDK({
  feature: {
    ratelimit: { active: true },
    retry: { active: true },
    test: { active: true },
    timeout: { active: true },
  }
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

