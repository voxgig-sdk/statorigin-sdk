"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const __1 = require("..");
const definition_runner_1 = require("./definition-runner");
const utility_1 = require("./utility");
// Generated from the API definition, not from the model this SDK was built
// from: the route, the declared query parameters, the credential the security
// scheme names, and the definition's own response example.
const PLAN = [
    {
        "entity": "indicator",
        "accessor": "Indicator",
        "op": "list",
        "method": "GET",
        "path": "/indicators",
        "args": [],
        "select": {
            "industry": "v1",
            "q": "v1"
        },
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [
            "industry",
            "q"
        ],
        "queryArgs": [
            {
                "name": "industry",
                "wire": "industry"
            },
            {
                "name": "q",
                "wire": "q"
            }
        ],
        "auth": null,
        "status": 200,
        "sample": {
            "data": [
                {
                    "id": "x",
                    "slug": "x",
                    "name": "x",
                    "unit": "x",
                    "definition": "x"
                }
            ],
            "meta": {
                "total": 1,
                "limit": 1,
                "next_cursor": "x",
                "attribution": "x",
                "license": "x",
                "docs": "x"
            }
        },
        "idField": "slug"
    },
    {
        "entity": "indicator",
        "accessor": "Indicator",
        "op": "load",
        "method": "GET",
        "path": "/indicators/{slug}",
        "args": [
            {
                "name": "id",
                "wire": "slug",
                "value": "global-ev-annual-sales"
            }
        ],
        "select": {},
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [],
        "queryArgs": [],
        "auth": null,
        "status": 200,
        "sample": {
            "data": {
                "id": "x",
                "slug": "x",
                "name": "x",
                "unit": "x",
                "definition": "x"
            },
            "meta": {
                "total": 1,
                "limit": 1,
                "next_cursor": "x",
                "attribution": "x",
                "license": "x",
                "docs": "x"
            }
        },
        "idField": "slug"
    },
    {
        "entity": "indicator",
        "accessor": "Indicator",
        "op": "load",
        "method": "GET",
        "path": "/indicators/{slug}/series",
        "action": "series",
        "args": [
            {
                "name": "slug",
                "wire": "slug",
                "value": "global-ev-annual-sales"
            }
        ],
        "select": {
            "from": 2015,
            "region": "v1",
            "to": 2026
        },
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [
            "region",
            "from",
            "to"
        ],
        "queryArgs": [
            {
                "name": "from",
                "wire": "from"
            },
            {
                "name": "region",
                "wire": "region"
            },
            {
                "name": "to",
                "wire": "to"
            }
        ],
        "auth": null,
        "status": 200,
        "sample": {
            "data": {},
            "meta": {
                "total": 1,
                "limit": 1,
                "next_cursor": "x",
                "attribution": "x",
                "license": "x",
                "docs": "x"
            }
        },
        "idField": "slug"
    },
    {
        "entity": "industry",
        "accessor": "Industry",
        "op": "list",
        "method": "GET",
        "path": "/industries",
        "args": [],
        "select": {
            "level": "v1",
            "parent": "C"
        },
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [
            "level",
            "parent"
        ],
        "queryArgs": [
            {
                "name": "level",
                "wire": "level"
            },
            {
                "name": "parent",
                "wire": "parent"
            }
        ],
        "auth": null,
        "status": 200,
        "sample": {
            "data": [
                {
                    "id": "x",
                    "slug": "x",
                    "name": "x",
                    "isic": "x",
                    "level": 1,
                    "parent_id": "x"
                }
            ],
            "meta": {
                "total": 1,
                "limit": 1,
                "next_cursor": "x",
                "attribution": "x",
                "license": "x",
                "docs": "x"
            }
        },
        "idField": "slug"
    },
    {
        "entity": "industry",
        "accessor": "Industry",
        "op": "load",
        "method": "GET",
        "path": "/industries/{slug}",
        "args": [
            {
                "name": "id",
                "wire": "slug",
                "value": "electric-vehicles"
            }
        ],
        "select": {},
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [],
        "queryArgs": [],
        "auth": null,
        "status": 200,
        "sample": {
            "data": {
                "id": "x",
                "slug": "x",
                "name": "x",
                "isic": "x",
                "level": 1,
                "parent_id": "x"
            },
            "meta": {
                "total": 1,
                "limit": 1,
                "next_cursor": "x",
                "attribution": "x",
                "license": "x",
                "docs": "x"
            }
        },
        "idField": "slug"
    },
    {
        "entity": "region",
        "accessor": "Region",
        "op": "list",
        "method": "GET",
        "path": "/regions",
        "args": [],
        "select": {
            "type": "v1"
        },
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [
            "type"
        ],
        "queryArgs": [
            {
                "name": "type",
                "wire": "type"
            }
        ],
        "auth": null,
        "status": 200,
        "sample": {
            "data": [
                {}
            ],
            "meta": {
                "total": 1,
                "limit": 1,
                "next_cursor": "x",
                "attribution": "x",
                "license": "x",
                "docs": "x"
            }
        },
        "idField": "id"
    },
    {
        "entity": "search",
        "accessor": "Search",
        "op": "load",
        "method": "GET",
        "path": "/search",
        "args": [],
        "select": {
            "q": "electric",
            "limit": 25
        },
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [
            "q",
            "limit"
        ],
        "queryArgs": [
            {
                "name": "limit",
                "wire": "limit"
            },
            {
                "name": "q",
                "wire": "q"
            }
        ],
        "auth": null,
        "status": 200,
        "sample": {
            "data": {},
            "meta": {
                "total": 1,
                "limit": 1,
                "next_cursor": "x",
                "attribution": "x",
                "license": "x",
                "docs": "x"
            }
        },
        "idField": "id"
    },
    {
        "entity": "source",
        "accessor": "Source",
        "op": "list",
        "method": "GET",
        "path": "/sources",
        "args": [],
        "select": {
            "tier": "v1"
        },
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [
            "tier"
        ],
        "queryArgs": [
            {
                "name": "tier",
                "wire": "tier"
            }
        ],
        "auth": null,
        "status": 200,
        "sample": {
            "data": [
                {
                    "id": "x",
                    "slug": "x",
                    "name": "x",
                    "short_name": "x",
                    "type": "x",
                    "tier": 1
                }
            ],
            "meta": {
                "total": 1,
                "limit": 1,
                "next_cursor": "x",
                "attribution": "x",
                "license": "x",
                "docs": "x"
            }
        },
        "idField": "slug"
    },
    {
        "entity": "source",
        "accessor": "Source",
        "op": "load",
        "method": "GET",
        "path": "/sources/{slug}",
        "args": [
            {
                "name": "id",
                "wire": "slug",
                "value": "international-energy-agency"
            }
        ],
        "select": {
            "limit": 100
        },
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [
            "limit"
        ],
        "queryArgs": [
            {
                "name": "limit",
                "wire": "limit"
            }
        ],
        "auth": null,
        "status": 200,
        "sample": {
            "data": {
                "id": "x",
                "slug": "x",
                "name": "x",
                "short_name": "x",
                "type": "x",
                "tier": 1
            },
            "meta": {
                "total": 1,
                "limit": 1,
                "next_cursor": "x",
                "attribution": "x",
                "license": "x",
                "docs": "x"
            }
        },
        "idField": "slug"
    },
    {
        "entity": "statistic",
        "accessor": "Statistic",
        "op": "list",
        "method": "GET",
        "path": "/statistics",
        "args": [],
        "select": {
            "cursor": "v1",
            "indicator": "global-ev-annual-sales",
            "industry": "electric-vehicles",
            "limit": 50,
            "region": "CN,US",
            "source_org": "international-energy-agency",
            "value_type": "v1",
            "year": "2020..2026"
        },
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [
            "industry",
            "region",
            "indicator",
            "year",
            "value_type",
            "source_org",
            "limit",
            "cursor"
        ],
        "queryArgs": [
            {
                "name": "cursor",
                "wire": "cursor"
            },
            {
                "name": "indicator",
                "wire": "indicator"
            },
            {
                "name": "industry",
                "wire": "industry"
            },
            {
                "name": "limit",
                "wire": "limit"
            },
            {
                "name": "region",
                "wire": "region"
            },
            {
                "name": "source_org",
                "wire": "source_org"
            },
            {
                "name": "value_type",
                "wire": "value_type"
            },
            {
                "name": "year",
                "wire": "year"
            }
        ],
        "auth": null,
        "status": 200,
        "sample": {
            "data": [
                {
                    "id": "x",
                    "url": "x",
                    "indicator": {
                        "slug": "x",
                        "name": "x",
                        "definition": "x"
                    },
                    "industry": [
                        {
                            "slug": "x",
                            "name": "x",
                            "isic": "x",
                            "is_primary": true
                        }
                    ],
                    "region": {
                        "code": "x",
                        "name": "x",
                        "type": "world"
                    },
                    "period": {
                        "start": "2026-01-01",
                        "end": "2026-01-01",
                        "type": "year"
                    },
                    "value": 1,
                    "value_text": "x",
                    "unit": "x",
                    "currency": "x",
                    "scale": "1",
                    "value_type": "actual",
                    "source": {
                        "org": "x",
                        "org_short_name": "x",
                        "org_url": "x",
                        "org_tier": 1,
                        "document_title": "x",
                        "document_url": "x",
                        "document_type": "x",
                        "locator": "x",
                        "quote": "x",
                        "evidence_type": "quote",
                        "dataset_query": {},
                        "dataset_evidence": {},
                        "published_date": "2026-01-01",
                        "accessed_at": "2026-01-01",
                        "license": "x",
                        "url_status": "ok",
                        "self_reported": true
                    },
                    "verification": "pending",
                    "verified_by": "x",
                    "verified_at": "2026-01-01T00:00:00Z",
                    "confidence": 1,
                    "is_secondhand": true,
                    "supersedes": "x",
                    "superseded_by": "x",
                    "is_current": true,
                    "citation": {
                        "apa": "x",
                        "bibtex": "x"
                    },
                    "updated_at": "2026-01-01T00:00:00Z"
                }
            ],
            "meta": {
                "total": 1,
                "limit": 1,
                "next_cursor": "x",
                "attribution": "x",
                "license": "x",
                "docs": "x"
            }
        },
        "idField": "id"
    },
    {
        "entity": "statistic",
        "accessor": "Statistic",
        "op": "load",
        "method": "GET",
        "path": "/statistics/{id}",
        "args": [
            {
                "name": "id",
                "wire": "id",
                "value": "stat_01M2HY9T5WMAQVXEKJ4XAX4XNG"
            }
        ],
        "select": {},
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [],
        "queryArgs": [],
        "auth": null,
        "status": 200,
        "sample": {
            "data": {
                "id": "x",
                "url": "x",
                "indicator": {
                    "slug": "x",
                    "name": "x",
                    "definition": "x"
                },
                "industry": [
                    {
                        "slug": "x",
                        "name": "x",
                        "isic": "x",
                        "is_primary": true
                    }
                ],
                "region": {
                    "code": "x",
                    "name": "x",
                    "type": "world"
                },
                "period": {
                    "start": "2026-01-01",
                    "end": "2026-01-01",
                    "type": "year"
                },
                "value": 1,
                "value_text": "x",
                "unit": "x",
                "currency": "x",
                "scale": "1",
                "value_type": "actual",
                "source": {
                    "org": "x",
                    "org_short_name": "x",
                    "org_url": "x",
                    "org_tier": 1,
                    "document_title": "x",
                    "document_url": "x",
                    "document_type": "x",
                    "locator": "x",
                    "quote": "x",
                    "evidence_type": "quote",
                    "dataset_query": {},
                    "dataset_evidence": {},
                    "published_date": "2026-01-01",
                    "accessed_at": "2026-01-01",
                    "license": "x",
                    "url_status": "ok",
                    "self_reported": true
                },
                "verification": "pending",
                "verified_by": "x",
                "verified_at": "2026-01-01T00:00:00Z",
                "confidence": 1,
                "is_secondhand": true,
                "supersedes": "x",
                "superseded_by": "x",
                "is_current": true,
                "citation": {
                    "apa": "x",
                    "bibtex": "x"
                },
                "updated_at": "2026-01-01T00:00:00Z"
            },
            "meta": {
                "total": 1,
                "limit": 1,
                "next_cursor": "x",
                "attribution": "x",
                "license": "x",
                "docs": "x"
            }
        },
        "idField": "id"
    }
];
(0, node_test_1.describe)('definition', () => {
    for (const point of PLAN) {
        (0, node_test_1.test)(point.entity + '.' + point.op + ' ' + point.method + ' ' + point.path, async (t) => {
            const control = (0, utility_1.isControlSkipped)('entityOp', point.entity + '.' + point.op, 'definition');
            if (control.skip) {
                t.skip(control.reason || 'skipped via sdk-test-control.json');
                return;
            }
            await (0, definition_runner_1.runDefinitionPoint)(__1.SDK, point);
        });
    }
});
//# sourceMappingURL=definition.test.js.map