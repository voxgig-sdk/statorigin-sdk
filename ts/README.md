# Statorigin TypeScript SDK



The TypeScript SDK for the Statorigin API — a type-safe, entity-oriented client with full async/await support.

The API is exposed as capitalised, semantic **Entities** — e.g.
`client.Indicator()` — each with a small set of operations (`list`, `load`)
instead of raw URL paths and query parameters. This keeps the surface
predictable and low-friction for both humans and AI agents.

> Also generated from this model: `go`, `go-cli`, `go-mcp`, `lua`, `php`, `py`, `rb` — see
> the [top-level README](../README.md).


## Install
This package is not yet published to npm. Install it from the GitHub
release tag (`ts/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/statorigin-sdk/tags)), or from a
clone, which carries the compiled `dist/`:

```bash
git clone https://github.com/voxgig-sdk/statorigin-sdk
npm install ./statorigin-sdk/ts
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```ts
import { StatoriginSDK } from '@voxgig-sdk/statorigin-sdk'

const client = new StatoriginSDK()
```

### 2. List indicator records

`list()` resolves to an array of Indicator ENTITIES — every operation
resolves to entities, not raw records. Iterate them directly, and call
`.data()` on one for the record it holds:

```ts
const indicators = await client.Indicator().list()

for (const indicator of indicators) {
  console.log(indicator.data())
}
```

### 3. Load an indicator

`load()` returns the entity and throws on failure; `.data()` reads its record:

```ts
try {
  const indicator = await client.Indicator().load({ id: 'example_id' })
  console.log(indicator.data())
} catch (err) {
  console.error('load failed:', err)
}
```


## Error handling

Entity operations reject on failure, so wrap them in `try` / `catch`:

```ts
try {
  const industrys = await client.Industry().list()
  console.log(industrys.map((item) => item.data()))
} catch (err) {
  console.error('list failed:', err)
}
```

The low-level `direct()` method does **not** throw — it returns the
result envelope. Branch on `ok`; on failure `status` holds the HTTP status
(for error responses) and `err` holds the error:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example_id' },
})

if (!result.ok) {
  console.error('request failed:', result.status, result.err)
}
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example' },
})

if (result.ok) {
  console.log(result.status)  // 200
  console.log(result.data)    // response body
}
```

### Prepare a request without sending it

```ts
const fetchdef = await client.prepare({
  path: '/api/resource/{id}',
  method: 'DELETE',
  params: { id: 'example' },
})

// Inspect before sending
console.log(fetchdef.url)
console.log(fetchdef.method)
console.log(fetchdef.headers)
```

### Use test mode

Create a mock client for unit testing — no server required:

```ts
const client = StatoriginSDK.test()

const industrys = await client.Industry().list()
// industrys is an array of Industry entities, one per mock record
console.log(industrys.map((industry) => industry.data()))
```

You can also use the instance method:

```ts
const client = new StatoriginSDK()
const testClient = client.tester()
```

### Retain entity state across calls

Entity instances remember their last match and data:

```ts
const entity = client.Industry()

// First call runs the operation and stores its result
await entity.list()

// Subsequent calls reuse the stored state
const data = entity.data()
console.log(data.slug)
```

### Add custom middleware

Pass features via the `extend` option:

```ts
const logger = {
  hooks: {
    PreRequest: (ctx: any) => {
      console.log('Requesting:', ctx.spec.method, ctx.spec.path)
    },
    PreResponse: (ctx: any) => {
      console.log('Status:', ctx.out.request?.status)
    },
  },
}

const client = new StatoriginSDK({
  extend: [logger],
})
```

### Run live tests

Create a `.env.local` file at the project root:

```
STATORIGIN_TEST_LIVE=TRUE
```

Then run:

```bash
cd ts && npm test
```

Live entity tests continue independent operations after errors and attempt
supported cleanup. Their final result reports failures and missing prerequisites
after the remaining work completes. The model and test inputs determine which
API operations the generated scenarios cover.


## Reference

### StatoriginSDK

#### Constructor

```ts
new StatoriginSDK(options?: {
  base?: string
  prefix?: string
  suffix?: string
  feature?: Record<string, { active: boolean }>
  extend?: Feature[]
})
```

| Option | Type | Description |
| --- | --- | --- |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `object` | Feature activation flags (e.g. `{ test: { active: true } }`). |
| `extend` | `Feature[]` | Additional feature instances to load. |

#### Methods

| Method | Returns | Description |
| --- | --- | --- |
| `options()` | `object` | Deep copy of current SDK options. |
| `utility()` | `Utility` | Deep copy of the SDK utility object. |
| `prepare(fetchargs?)` | `Promise<FetchDef>` | Build an HTTP request definition without sending it. |
| `direct(fetchargs?)` | `Promise<DirectResult>` | Build and send an HTTP request. |
| `Indicator(data?)` | `IndicatorEntity` | Create an Indicator entity instance. |
| `Industry(data?)` | `IndustryEntity` | Create an Industry entity instance. |
| `Region(data?)` | `RegionEntity` | Create a Region entity instance. |
| `Search(data?)` | `SearchEntity` | Create a Search entity instance. |
| `Source(data?)` | `SourceEntity` | Create a Source entity instance. |
| `Statistic(data?)` | `StatisticEntity` | Create a Statistic entity instance. |
| `tester(testopts?, sdkopts?)` | `StatoriginSDK` | Create a test-mode client instance. |

#### Static methods

| Method | Returns | Description |
| --- | --- | --- |
| `StatoriginSDK.test(testopts?, sdkopts?)` | `StatoriginSDK` | Create a test-mode client. |

### Entity interface

All entities share the same interface.

#### Methods

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `load(reqmatch?, ctrl?): Promise<Entity>` | Load a single entity by match criteria, and return it. |
| `list` | `list(reqmatch?, ctrl?): Promise<Entity[]>` | List entities matching the criteria, one per record. |
| `data` | `data(data?: Partial<Entity>): Entity` | Get or set entity data. |
| `match` | `match(match?: Partial<Entity>): Partial<Entity>` | Get or set entity match criteria. |
| `make` | `make(): Entity` | Create a new instance with the same options. |
| `client` | `client(): StatoriginSDK` | Return the parent SDK client. |
| `entopts` | `entopts(): object` | Return a copy of the entity options. |

#### Return values

Entity operations resolve to the entity itself — there is no result
envelope, and an entity's `data()` reads its record:

- `load` resolves to a single entity object.
- `list` resolves to an **array** of entity objects (iterate it directly;
  there is no `.data` and no `.ok`).

On a failed request these methods **throw**, so wrap calls in
`try`/`catch` to handle errors. Only `direct()` returns the result
envelope described below.

### DirectResult shape

The `direct()` method returns:

```ts
{
  ok: boolean
  status: number
  headers: object
  data: any
}
```

On error, `ok` is `false` and an `err` property contains the error.

### FetchDef shape

The `prepare()` method returns:

```ts
{
  url: string
  method: string
  headers: Record<string, string>
  body?: any
}
```

### Entities

#### Indicator

| Field | Description |
| --- | --- |
| `definition` |  |
| `id` | Stable prefixed identifier. |
| `name` |  |
| `slug` | URL key: the item routes take this. |
| `unit` |  |

Operations: list, load.

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

Operations: list, load.

API path: `/industries`

#### Region

| Field | Description |
| --- | --- |
| `data` |  |
| `meta` |  |

Operations: list.

API path: `/regions`

#### Search

| Field | Description |
| --- | --- |

Operations: load.

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

Operations: list, load.

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

Operations: list, load.

API path: `/statistics`



## Entities


### Indicator

Create an instance: `const indicator = client.Indicator()`

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

```ts
const indicator = await client.Indicator().load({ id: 'indicator_id' })
```

#### Example: List

```ts
const indicators = await client.Indicator().list()
```


### Industry

Create an instance: `const industry = client.Industry()`

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

```ts
const industry = await client.Industry().load({ id: 'industry_id' })
```

#### Example: List

```ts
const industrys = await client.Industry().list()
```


### Region

Create an instance: `const region = client.Region()`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `data` | `any[]` |  |
| `meta` | `Record<string, any>` |  |

#### Example: List

```ts
const regions = await client.Region().list()
```


### Search

Create an instance: `const search = client.Search()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Example: Load

```ts
const search = await client.Search().load({ q: 'q' })
```


### Source

Create an instance: `const source = client.Source()`

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

```ts
const source = await client.Source().load({ id: 'source_id' })
```

#### Example: List

```ts
const sources = await client.Source().list()
```


### Statistic

Create an instance: `const statistic = client.Statistic()`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `citation` | `Record<string, any>` |  |
| `confidence` | `number | null` |  |
| `currency` | `string | null` |  |
| `id` | `string` |  |
| `indicator` | `Record<string, any>` |  |
| `industry` | `any[]` |  |
| `is_current` | `boolean` | False once superseded_by is set |
| `is_secondhand` | `boolean` | True when the figure was relayed from a secondary source |
| `period` | `Record<string, any>` |  |
| `region` | `Record<string, any>` |  |
| `scale` | `string` |  |
| `source` | `Record<string, any>` | Complete provenance. |
| `superseded_by` | `string | null` | Id of the newer record that corrected this one. |
| `supersedes` | `string | null` | Id of the older record this one corrected, if any |
| `unit` | `string` |  |
| `updated_at` | `string` |  |
| `url` | `string` |  |
| `value` | `number` |  |
| `value_text` | `string | null` | The source's own phrasing, preserved verbatim |
| `value_type` | `string` |  |
| `verification` | `string` |  |
| `verified_at` | `string | null` |  |
| `verified_by` | `string | null` |  |

#### Example: Load

```ts
const statistic = await client.Statistic().load({ id: 'statistic_id' })
```

#### Example: List

```ts
const statistics = await client.Statistic().list()
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

Features are the extension mechanism. A feature is an object with a
`hooks` map. Each hook key is a pipeline stage name, and the value is
a function that receives the context.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Module structure

```
statorigin/
├── src/
│   ├── StatoriginSDK.ts        # Main SDK class
│   ├── entity/             # Entity implementations
│   ├── feature/            # Built-in features (Base, Test, Log)
│   └── utility/            # Utility functions
├── test/                   # Test suites
└── dist/                   # Compiled output
```

Import the SDK from the package root:

```ts
import { StatoriginSDK } from '@voxgig-sdk/statorigin-sdk'
```

### Entity state

Entity instances are stateful. After a successful `list`, the entity
stores the returned data and match criteria internally. Subsequent
calls on the same instance can rely on this state.

```ts
const industry = client.Industry()
await industry.list()

// industry.data() now returns the industry data from the last `list`
// industry.match() returns the last match criteria
```

Call `make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

The `direct` method gives full control over the HTTP request. Use it
for non-standard endpoints, bulk operations, or any path not modelled
as an entity. The `prepare` method is useful for debugging — it
shows exactly what `direct` would send.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
