# Statorigin SDK configuration


# The sekreto plugin DEFINITIONS the model selected per feature, imported
# above by name from the modules the catalogue's active `plugin.def`
# entries declare. Handed to each feature (secrets builds its Sekreto
# with them): a provider kind not listed here is unknown to that SDK.
FEATURE_PLUGINS = {
}


_shared_config = None


def shared_config():
    """Return the process-wide config, built once on first use.

    The SDK reads the config on every request and never writes to it, so one
    instance is shared by every client rather than rebuilt per client.

    The returned dict is shared: treat it as read-only. Callers that need to
    mutate should use make_config, which always returns a fresh copy.
    """
    global _shared_config
    if _shared_config is None:
        _shared_config = make_config()
    return _shared_config


def make_config():
    """Build a fresh, fully materialised config dict.

    Every call rebuilds the whole structure, so prefer shared_config unless
    you need a private copy you intend to mutate.
    """
    return {
        "main": {
            "name": "Statorigin",
            "slug": "statorigin",
            "version": "0.0.1",
            "target": "py",
        },
        "feature": {
            "ratelimit": {
        "options": {
          "active": False,
          "burst": 5,
          "rate": 5,
        },
        "optspec": {
          "now": "`$FUNCTION`",
          "sleep": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
            "retry": {
        "options": {
          "active": False,
          "factor": 2,
          "maxDelay": 2000,
          "minDelay": 50,
          "retries": 2,
          "statuses": [
            408,
            425,
            429,
            500,
            502,
            503,
            504,
          ],
        },
        "optspec": {
          "jitter": "`$BOOLEAN`",
          "sleep": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
            "test": {
        "options": {
          "active": False,
        },
        "optspec": {
          "entity": "`$MAP`",
          "net": "`$MAP`",
        },
        "strict": False,
        "transport": "base",
      },
            "timeout": {
        "options": {
          "active": False,
          "ms": 30000,
        },
        "optspec": {
          "clearTimer": "`$FUNCTION`",
          "now": "`$FUNCTION`",
          "setTimer": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
        },
        "options": {
            "base": "https://statorigin.org/api/v1",
            "headers": {
        "content-type": "application/json",
      },
            "entity": {
                "indicator": {},
                "industry": {},
                "region": {},
                "search": {},
                "source": {},
                "statistic": {},
            },
        },
        "entity": {
      "indicator": {
        "fields": [
          {
            "name": "definition",
            "title": "Definition",
            "type": "`$STRING`",
          },
          {
            "name": "id",
            "title": "Id",
            "type": "`$STRING`",
            "short": "Stable prefixed identifier.",
          },
          {
            "name": "name",
            "title": "Name",
            "type": "`$STRING`",
          },
          {
            "name": "slug",
            "title": "Slug",
            "type": "`$STRING`",
            "short": "URL key: the item routes take this.",
          },
          {
            "name": "unit",
            "title": "Unit",
            "type": "`$STRING`",
          },
        ],
        "id": {
          "field": "slug",
          "name": "id",
        },
        "name": "indicator",
        "op": {
          "list": {
            "input": "data",
            "name": "list",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/indicators",
                "segments": [
                  {
                    "lit": "indicators",
                  },
                ],
                "parts": [
                  "indicators",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.data`",
                },
                "args": {
                  "query": [
                    {
                      "name": "industry",
                      "orig": "industry",
                      "type": "`$STRING`",
                      "kind": "query",
                    },
                    {
                      "name": "q",
                      "orig": "q",
                      "type": "`$STRING`",
                      "kind": "query",
                    },
                  ],
                },
                "select": {},
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
                "alias": {
                  "id": "slug",
                },
              },
            ],
          },
          "load": {
            "input": "data",
            "name": "load",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/indicators/{slug}",
                "segments": [
                  {
                    "lit": "indicators",
                  },
                  {
                    "var": "id",
                  },
                ],
                "parts": [
                  "indicators",
                  "{id}",
                ],
                "rename": {
                  "param": {
                    "slug": "id",
                  },
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.data`",
                },
                "args": {
                  "params": [
                    {
                      "name": "id",
                      "orig": "slug",
                      "type": "`$STRING`",
                      "kind": "param",
                      "reqd": True,
                      "example": "global-ev-annual-sales",
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "id",
                  ],
                },
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
                "alias": {
                  "id": "slug",
                },
              },
              {
                "kind": "http",
                "method": "GET",
                "orig": "/indicators/{slug}/series",
                "segments": [
                  {
                    "lit": "indicators",
                  },
                  {
                    "var": "slug",
                  },
                  {
                    "lit": "series",
                  },
                ],
                "parts": [
                  "indicators",
                  "{slug}",
                  "series",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.data`",
                },
                "args": {
                  "params": [
                    {
                      "name": "slug",
                      "orig": "slug",
                      "type": "`$STRING`",
                      "kind": "param",
                      "reqd": True,
                      "example": "global-ev-annual-sales",
                    },
                  ],
                  "query": [
                    {
                      "name": "from",
                      "orig": "from",
                      "type": "`$INTEGER`",
                      "kind": "query",
                      "example": 2015,
                    },
                    {
                      "name": "region",
                      "orig": "region",
                      "type": "`$STRING`",
                      "kind": "query",
                    },
                    {
                      "name": "to",
                      "orig": "to",
                      "type": "`$INTEGER`",
                      "kind": "query",
                      "example": 2026,
                    },
                  ],
                },
                "select": {
                  "$action": "series",
                  "exist": [
                    "slug",
                  ],
                },
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
                "alias": {
                  "id": "slug",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "industry": {
        "fields": [
          {
            "name": "id",
            "title": "Id",
            "type": "`$STRING`",
            "short": "Stable prefixed identifier.",
          },
          {
            "name": "isic",
            "title": "Isic",
            "type": "`$STRING`",
          },
          {
            "name": "level",
            "title": "Level",
            "type": "`$INTEGER`",
          },
          {
            "name": "name",
            "title": "Name",
            "type": "`$STRING`",
          },
          {
            "name": "parent_id",
            "title": "Parent Id",
            "type": "`$STRING`",
          },
          {
            "name": "slug",
            "title": "Slug",
            "type": "`$STRING`",
            "short": "URL key: the item routes take this.",
          },
        ],
        "id": {
          "field": "slug",
          "name": "id",
        },
        "name": "industry",
        "op": {
          "list": {
            "input": "data",
            "name": "list",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/industries",
                "segments": [
                  {
                    "lit": "industries",
                  },
                ],
                "parts": [
                  "industries",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.data`",
                },
                "args": {
                  "query": [
                    {
                      "name": "level",
                      "orig": "level",
                      "type": "`$INTEGER`",
                      "kind": "query",
                      "field": True,
                    },
                    {
                      "name": "parent",
                      "orig": "parent",
                      "type": "`$STRING`",
                      "kind": "query",
                      "example": "C",
                    },
                  ],
                },
                "select": {},
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
                "alias": {
                  "id": "slug",
                },
              },
            ],
          },
          "load": {
            "input": "data",
            "name": "load",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/industries/{slug}",
                "segments": [
                  {
                    "lit": "industries",
                  },
                  {
                    "var": "id",
                  },
                ],
                "parts": [
                  "industries",
                  "{id}",
                ],
                "rename": {
                  "param": {
                    "slug": "id",
                  },
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.data`",
                },
                "args": {
                  "params": [
                    {
                      "name": "id",
                      "orig": "slug",
                      "type": "`$STRING`",
                      "kind": "param",
                      "reqd": True,
                      "example": "electric-vehicles",
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "id",
                  ],
                },
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
                "alias": {
                  "id": "slug",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "region": {
        "fields": [
          {
            "name": "data",
            "title": "Data",
            "type": "`$ARRAY`",
          },
          {
            "name": "meta",
            "title": "Meta",
            "type": "`$OBJECT`",
          },
        ],
        "name": "region",
        "op": {
          "list": {
            "input": "data",
            "name": "list",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/regions",
                "segments": [
                  {
                    "lit": "regions",
                  },
                ],
                "parts": [
                  "regions",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.data`",
                },
                "args": {
                  "query": [
                    {
                      "name": "type",
                      "orig": "type",
                      "type": "`$STRING`",
                      "kind": "query",
                    },
                  ],
                },
                "select": {},
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "search": {
        "fields": [],
        "name": "search",
        "op": {
          "load": {
            "input": "data",
            "name": "load",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/search",
                "segments": [
                  {
                    "lit": "search",
                  },
                ],
                "parts": [
                  "search",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.data`",
                },
                "args": {
                  "query": [
                    {
                      "name": "limit",
                      "orig": "limit",
                      "type": "`$INTEGER`",
                      "kind": "query",
                      "example": 25,
                    },
                    {
                      "name": "q",
                      "orig": "q",
                      "type": "`$STRING`",
                      "kind": "query",
                      "reqd": True,
                      "example": "electric",
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "q",
                  ],
                },
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "source": {
        "fields": [
          {
            "name": "id",
            "title": "Id",
            "type": "`$STRING`",
            "short": "Stable prefixed identifier.",
          },
          {
            "name": "name",
            "title": "Name",
            "type": "`$STRING`",
          },
          {
            "name": "short_name",
            "title": "Short Name",
            "type": "`$STRING`",
          },
          {
            "name": "slug",
            "title": "Slug",
            "type": "`$STRING`",
            "short": "URL key: the item routes take this.",
          },
          {
            "name": "tier",
            "title": "Tier",
            "type": "`$INTEGER`",
          },
          {
            "name": "type",
            "title": "Type",
            "type": "`$STRING`",
          },
        ],
        "id": {
          "field": "slug",
          "name": "id",
        },
        "name": "source",
        "op": {
          "list": {
            "input": "data",
            "name": "list",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/sources",
                "segments": [
                  {
                    "lit": "sources",
                  },
                ],
                "parts": [
                  "sources",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.data`",
                },
                "args": {
                  "query": [
                    {
                      "name": "tier",
                      "orig": "tier",
                      "type": "`$INTEGER`",
                      "kind": "query",
                      "field": True,
                    },
                  ],
                },
                "select": {},
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
                "alias": {
                  "id": "slug",
                },
              },
            ],
          },
          "load": {
            "input": "data",
            "name": "load",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/sources/{slug}",
                "segments": [
                  {
                    "lit": "sources",
                  },
                  {
                    "var": "id",
                  },
                ],
                "parts": [
                  "sources",
                  "{id}",
                ],
                "rename": {
                  "param": {
                    "slug": "id",
                  },
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.data`",
                },
                "args": {
                  "params": [
                    {
                      "name": "id",
                      "orig": "slug",
                      "type": "`$STRING`",
                      "kind": "param",
                      "reqd": True,
                      "example": "international-energy-agency",
                    },
                  ],
                  "query": [
                    {
                      "name": "limit",
                      "orig": "limit",
                      "type": "`$INTEGER`",
                      "kind": "query",
                      "example": 100,
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "id",
                  ],
                },
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
                "alias": {
                  "id": "slug",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "statistic": {
        "fields": [
          {
            "name": "citation",
            "title": "Citation",
            "type": "`$OBJECT`",
            "req": True,
          },
          {
            "name": "confidence",
            "title": "Confidence",
            "type": [
              "`$ONE`",
              [
                "`$NUMBER`",
                "`$NULL`",
              ],
            ],
          },
          {
            "name": "currency",
            "title": "Currency",
            "type": [
              "`$ONE`",
              [
                "`$STRING`",
                "`$NULL`",
              ],
            ],
          },
          {
            "name": "id",
            "title": "Id",
            "type": "`$STRING`",
            "req": True,
          },
          {
            "name": "indicator",
            "title": "Indicator",
            "type": "`$OBJECT`",
            "req": True,
          },
          {
            "name": "industry",
            "title": "Industry",
            "type": "`$ARRAY`",
          },
          {
            "name": "is_current",
            "title": "Is Current",
            "type": "`$BOOLEAN`",
            "short": "False once superseded_by is set",
          },
          {
            "name": "is_secondhand",
            "title": "Is Secondhand",
            "type": "`$BOOLEAN`",
            "short": "True when the figure was relayed from a secondary source",
          },
          {
            "name": "period",
            "title": "Period",
            "type": "`$OBJECT`",
            "req": True,
          },
          {
            "name": "region",
            "title": "Region",
            "type": "`$OBJECT`",
            "req": True,
          },
          {
            "name": "scale",
            "title": "Scale",
            "type": "`$STRING`",
          },
          {
            "name": "source",
            "title": "Source",
            "type": "`$OBJECT`",
            "req": True,
            "short": "Complete provenance.",
          },
          {
            "name": "superseded_by",
            "title": "Superseded By",
            "type": [
              "`$ONE`",
              [
                "`$STRING`",
                "`$NULL`",
              ],
            ],
            "short": "Id of the newer record that corrected this one.",
          },
          {
            "name": "supersedes",
            "title": "Supersedes",
            "type": [
              "`$ONE`",
              [
                "`$STRING`",
                "`$NULL`",
              ],
            ],
            "short": "Id of the older record this one corrected, if any",
          },
          {
            "name": "unit",
            "title": "Unit",
            "type": "`$STRING`",
            "req": True,
          },
          {
            "name": "updated_at",
            "title": "Updated At",
            "type": "`$STRING`",
            "format": "date-time",
          },
          {
            "name": "url",
            "title": "Url",
            "type": "`$STRING`",
            "req": True,
            "format": "uri",
          },
          {
            "name": "value",
            "title": "Value",
            "type": "`$NUMBER`",
            "req": True,
          },
          {
            "name": "value_text",
            "title": "Value Text",
            "type": [
              "`$ONE`",
              [
                "`$STRING`",
                "`$NULL`",
              ],
            ],
            "short": "The source's own phrasing, preserved verbatim",
          },
          {
            "name": "value_type",
            "title": "Value Type",
            "type": "`$STRING`",
          },
          {
            "name": "verification",
            "title": "Verification",
            "type": "`$STRING`",
          },
          {
            "name": "verified_at",
            "title": "Verified At",
            "type": [
              "`$ONE`",
              [
                "`$STRING`",
                "`$NULL`",
              ],
            ],
            "format": "date-time",
          },
          {
            "name": "verified_by",
            "title": "Verified By",
            "type": [
              "`$ONE`",
              [
                "`$STRING`",
                "`$NULL`",
              ],
            ],
          },
        ],
        "id": {
          "field": "id",
          "name": "id",
        },
        "name": "statistic",
        "op": {
          "list": {
            "input": "data",
            "name": "list",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/statistics",
                "segments": [
                  {
                    "lit": "statistics",
                  },
                ],
                "parts": [
                  "statistics",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.data`",
                },
                "args": {
                  "query": [
                    {
                      "name": "cursor",
                      "orig": "cursor",
                      "type": "`$STRING`",
                      "kind": "query",
                    },
                    {
                      "name": "indicator",
                      "orig": "indicator",
                      "type": "`$STRING`",
                      "kind": "query",
                      "example": "global-ev-annual-sales",
                      "field": True,
                    },
                    {
                      "name": "industry",
                      "orig": "industry",
                      "type": "`$STRING`",
                      "kind": "query",
                      "example": "electric-vehicles",
                      "field": True,
                    },
                    {
                      "name": "limit",
                      "orig": "limit",
                      "type": "`$INTEGER`",
                      "kind": "query",
                      "example": 50,
                    },
                    {
                      "name": "region",
                      "orig": "region",
                      "type": "`$STRING`",
                      "kind": "query",
                      "example": "CN,US",
                      "field": True,
                    },
                    {
                      "name": "source_org",
                      "orig": "source_org",
                      "type": "`$STRING`",
                      "kind": "query",
                      "example": "international-energy-agency",
                    },
                    {
                      "name": "value_type",
                      "orig": "value_type",
                      "type": "`$STRING`",
                      "kind": "query",
                      "field": True,
                    },
                    {
                      "name": "year",
                      "orig": "year",
                      "type": "`$STRING`",
                      "kind": "query",
                      "example": "2020..2026",
                    },
                  ],
                },
                "select": {},
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
              },
            ],
          },
          "load": {
            "input": "data",
            "name": "load",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/statistics/{id}",
                "segments": [
                  {
                    "lit": "statistics",
                  },
                  {
                    "var": "id",
                  },
                ],
                "parts": [
                  "statistics",
                  "{id}",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.data`",
                },
                "args": {
                  "params": [
                    {
                      "name": "id",
                      "orig": "id",
                      "type": "`$STRING`",
                      "kind": "param",
                      "reqd": True,
                      "example": "stat_01M2HY9T5WMAQVXEKJ4XAX4XNG",
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "id",
                  ],
                },
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
    },
    }
