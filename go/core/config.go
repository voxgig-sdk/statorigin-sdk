package core

import (
	"sync"
)

// MakeConfig builds a fresh, fully materialised config map. Every call
// rebuilds the whole structure, so prefer SharedConfig unless you need a
// private copy you intend to mutate.
func MakeConfig() map[string]any {
	return map[string]any{
		"main": map[string]any{
			"name": "Statorigin",
			"slug": "statorigin",
			"version": "0.0.1",
			"target": "go",
		},
		"feature": map[string]any{
			"ratelimit": map[string]any{
				"options": map[string]any{
					"active": false,
					"burst": 5,
					"rate": 5,
				},
				"optspec": map[string]any{
					"now": "`$FUNCTION`",
					"sleep": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
			"retry": map[string]any{
				"options": map[string]any{
					"active": false,
					"factor": 2,
					"maxDelay": 2000,
					"minDelay": 50,
					"retries": 2,
					"statuses": []any{
						408,
						425,
						429,
						500,
						502,
						503,
						504,
					},
				},
				"optspec": map[string]any{
					"jitter": "`$BOOLEAN`",
					"sleep": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
			"test": map[string]any{
				"options": map[string]any{
					"active": false,
				},
				"optspec": map[string]any{
					"entity": "`$MAP`",
					"net": "`$MAP`",
				},
				"strict": false,
				"transport": "base",
			},
			"timeout": map[string]any{
				"options": map[string]any{
					"active": false,
					"ms": 30000,
				},
				"optspec": map[string]any{
					"clearTimer": "`$FUNCTION`",
					"now": "`$FUNCTION`",
					"setTimer": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
		},
		"options": map[string]any{
			"base": "https://statorigin.org/api/v1",
			"headers": map[string]any{
				"content-type": "application/json",
			},
			"entity": map[string]any{
				"indicator": map[string]any{},
				"industry": map[string]any{},
				"region": map[string]any{},
				"search": map[string]any{},
				"source": map[string]any{},
				"statistic": map[string]any{},
			},
		},
		"entity": map[string]any{
			"indicator": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "definition",
						"title": "Definition",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "id",
						"title": "Id",
						"type": "`$STRING`",
						"short": "Stable prefixed identifier.",
					},
					map[string]any{
						"name": "name",
						"title": "Name",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "slug",
						"title": "Slug",
						"type": "`$STRING`",
						"short": "URL key: the item routes take this.",
					},
					map[string]any{
						"name": "unit",
						"title": "Unit",
						"type": "`$STRING`",
					},
				},
				"id": map[string]any{
					"field": "slug",
					"name": "id",
				},
				"name": "indicator",
				"op": map[string]any{
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/indicators",
								"segments": []any{
									map[string]any{
										"lit": "indicators",
									},
								},
								"parts": []any{
									"indicators",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "industry",
											"orig": "industry",
											"type": "`$STRING`",
											"kind": "query",
										},
										map[string]any{
											"name": "q",
											"orig": "q",
											"type": "`$STRING`",
											"kind": "query",
										},
									},
								},
								"select": map[string]any{},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
								"alias": map[string]any{
									"id": "slug",
								},
							},
						},
					},
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/indicators/{slug}",
								"segments": []any{
									map[string]any{
										"lit": "indicators",
									},
									map[string]any{
										"var": "id",
									},
								},
								"parts": []any{
									"indicators",
									"{id}",
								},
								"rename": map[string]any{
									"param": map[string]any{
										"slug": "id",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "slug",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
											"example": "global-ev-annual-sales",
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
									},
								},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
								"alias": map[string]any{
									"id": "slug",
								},
							},
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/indicators/{slug}/series",
								"segments": []any{
									map[string]any{
										"lit": "indicators",
									},
									map[string]any{
										"var": "slug",
									},
									map[string]any{
										"lit": "series",
									},
								},
								"parts": []any{
									"indicators",
									"{slug}",
									"series",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "slug",
											"orig": "slug",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
											"example": "global-ev-annual-sales",
										},
									},
									"query": []any{
										map[string]any{
											"name": "from",
											"orig": "from",
											"type": "`$INTEGER`",
											"kind": "query",
											"example": 2015,
										},
										map[string]any{
											"name": "region",
											"orig": "region",
											"type": "`$STRING`",
											"kind": "query",
										},
										map[string]any{
											"name": "to",
											"orig": "to",
											"type": "`$INTEGER`",
											"kind": "query",
											"example": 2026,
										},
									},
								},
								"select": map[string]any{
									"$action": "series",
									"exist": []any{
										"slug",
									},
								},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
								"alias": map[string]any{
									"id": "slug",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"industry": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "id",
						"title": "Id",
						"type": "`$STRING`",
						"short": "Stable prefixed identifier.",
					},
					map[string]any{
						"name": "isic",
						"title": "Isic",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "level",
						"title": "Level",
						"type": "`$INTEGER`",
					},
					map[string]any{
						"name": "name",
						"title": "Name",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "parent_id",
						"title": "Parent Id",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "slug",
						"title": "Slug",
						"type": "`$STRING`",
						"short": "URL key: the item routes take this.",
					},
				},
				"id": map[string]any{
					"field": "slug",
					"name": "id",
				},
				"name": "industry",
				"op": map[string]any{
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/industries",
								"segments": []any{
									map[string]any{
										"lit": "industries",
									},
								},
								"parts": []any{
									"industries",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "level",
											"orig": "level",
											"type": "`$INTEGER`",
											"kind": "query",
											"field": true,
										},
										map[string]any{
											"name": "parent",
											"orig": "parent",
											"type": "`$STRING`",
											"kind": "query",
											"example": "C",
										},
									},
								},
								"select": map[string]any{},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
								"alias": map[string]any{
									"id": "slug",
								},
							},
						},
					},
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/industries/{slug}",
								"segments": []any{
									map[string]any{
										"lit": "industries",
									},
									map[string]any{
										"var": "id",
									},
								},
								"parts": []any{
									"industries",
									"{id}",
								},
								"rename": map[string]any{
									"param": map[string]any{
										"slug": "id",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "slug",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
											"example": "electric-vehicles",
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
									},
								},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
								"alias": map[string]any{
									"id": "slug",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"region": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "data",
						"title": "Data",
						"type": "`$ARRAY`",
					},
					map[string]any{
						"name": "meta",
						"title": "Meta",
						"type": "`$OBJECT`",
					},
				},
				"name": "region",
				"op": map[string]any{
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/regions",
								"segments": []any{
									map[string]any{
										"lit": "regions",
									},
								},
								"parts": []any{
									"regions",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "type",
											"orig": "type",
											"type": "`$STRING`",
											"kind": "query",
										},
									},
								},
								"select": map[string]any{},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"search": map[string]any{
				"fields": []any{},
				"name": "search",
				"op": map[string]any{
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/search",
								"segments": []any{
									map[string]any{
										"lit": "search",
									},
								},
								"parts": []any{
									"search",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "limit",
											"orig": "limit",
											"type": "`$INTEGER`",
											"kind": "query",
											"example": 25,
										},
										map[string]any{
											"name": "q",
											"orig": "q",
											"type": "`$STRING`",
											"kind": "query",
											"reqd": true,
											"example": "electric",
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"q",
									},
								},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"source": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "id",
						"title": "Id",
						"type": "`$STRING`",
						"short": "Stable prefixed identifier.",
					},
					map[string]any{
						"name": "name",
						"title": "Name",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "short_name",
						"title": "Short Name",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "slug",
						"title": "Slug",
						"type": "`$STRING`",
						"short": "URL key: the item routes take this.",
					},
					map[string]any{
						"name": "tier",
						"title": "Tier",
						"type": "`$INTEGER`",
					},
					map[string]any{
						"name": "type",
						"title": "Type",
						"type": "`$STRING`",
					},
				},
				"id": map[string]any{
					"field": "slug",
					"name": "id",
				},
				"name": "source",
				"op": map[string]any{
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/sources",
								"segments": []any{
									map[string]any{
										"lit": "sources",
									},
								},
								"parts": []any{
									"sources",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "tier",
											"orig": "tier",
											"type": "`$INTEGER`",
											"kind": "query",
											"field": true,
										},
									},
								},
								"select": map[string]any{},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
								"alias": map[string]any{
									"id": "slug",
								},
							},
						},
					},
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/sources/{slug}",
								"segments": []any{
									map[string]any{
										"lit": "sources",
									},
									map[string]any{
										"var": "id",
									},
								},
								"parts": []any{
									"sources",
									"{id}",
								},
								"rename": map[string]any{
									"param": map[string]any{
										"slug": "id",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "slug",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
											"example": "international-energy-agency",
										},
									},
									"query": []any{
										map[string]any{
											"name": "limit",
											"orig": "limit",
											"type": "`$INTEGER`",
											"kind": "query",
											"example": 100,
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
									},
								},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
								"alias": map[string]any{
									"id": "slug",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"statistic": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "citation",
						"title": "Citation",
						"type": "`$OBJECT`",
						"req": true,
					},
					map[string]any{
						"name": "confidence",
						"title": "Confidence",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$NUMBER`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "currency",
						"title": "Currency",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "id",
						"title": "Id",
						"type": "`$STRING`",
						"req": true,
					},
					map[string]any{
						"name": "indicator",
						"title": "Indicator",
						"type": "`$OBJECT`",
						"req": true,
					},
					map[string]any{
						"name": "industry",
						"title": "Industry",
						"type": "`$ARRAY`",
					},
					map[string]any{
						"name": "is_current",
						"title": "Is Current",
						"type": "`$BOOLEAN`",
						"short": "False once superseded_by is set",
					},
					map[string]any{
						"name": "is_secondhand",
						"title": "Is Secondhand",
						"type": "`$BOOLEAN`",
						"short": "True when the figure was relayed from a secondary source",
					},
					map[string]any{
						"name": "period",
						"title": "Period",
						"type": "`$OBJECT`",
						"req": true,
					},
					map[string]any{
						"name": "region",
						"title": "Region",
						"type": "`$OBJECT`",
						"req": true,
					},
					map[string]any{
						"name": "scale",
						"title": "Scale",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "source",
						"title": "Source",
						"type": "`$OBJECT`",
						"req": true,
						"short": "Complete provenance.",
					},
					map[string]any{
						"name": "superseded_by",
						"title": "Superseded By",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
						"short": "Id of the newer record that corrected this one.",
					},
					map[string]any{
						"name": "supersedes",
						"title": "Supersedes",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
						"short": "Id of the older record this one corrected, if any",
					},
					map[string]any{
						"name": "unit",
						"title": "Unit",
						"type": "`$STRING`",
						"req": true,
					},
					map[string]any{
						"name": "updated_at",
						"title": "Updated At",
						"type": "`$STRING`",
						"format": "date-time",
					},
					map[string]any{
						"name": "url",
						"title": "Url",
						"type": "`$STRING`",
						"req": true,
						"format": "uri",
					},
					map[string]any{
						"name": "value",
						"title": "Value",
						"type": "`$NUMBER`",
						"req": true,
					},
					map[string]any{
						"name": "value_text",
						"title": "Value Text",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
						"short": "The source's own phrasing, preserved verbatim",
					},
					map[string]any{
						"name": "value_type",
						"title": "Value Type",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "verification",
						"title": "Verification",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "verified_at",
						"title": "Verified At",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
						"format": "date-time",
					},
					map[string]any{
						"name": "verified_by",
						"title": "Verified By",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
					},
				},
				"id": map[string]any{
					"field": "id",
					"name": "id",
				},
				"name": "statistic",
				"op": map[string]any{
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/statistics",
								"segments": []any{
									map[string]any{
										"lit": "statistics",
									},
								},
								"parts": []any{
									"statistics",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "cursor",
											"orig": "cursor",
											"type": "`$STRING`",
											"kind": "query",
										},
										map[string]any{
											"name": "indicator",
											"orig": "indicator",
											"type": "`$STRING`",
											"kind": "query",
											"example": "global-ev-annual-sales",
											"field": true,
										},
										map[string]any{
											"name": "industry",
											"orig": "industry",
											"type": "`$STRING`",
											"kind": "query",
											"example": "electric-vehicles",
											"field": true,
										},
										map[string]any{
											"name": "limit",
											"orig": "limit",
											"type": "`$INTEGER`",
											"kind": "query",
											"example": 50,
										},
										map[string]any{
											"name": "region",
											"orig": "region",
											"type": "`$STRING`",
											"kind": "query",
											"example": "CN,US",
											"field": true,
										},
										map[string]any{
											"name": "source_org",
											"orig": "source_org",
											"type": "`$STRING`",
											"kind": "query",
											"example": "international-energy-agency",
										},
										map[string]any{
											"name": "value_type",
											"orig": "value_type",
											"type": "`$STRING`",
											"kind": "query",
											"field": true,
										},
										map[string]any{
											"name": "year",
											"orig": "year",
											"type": "`$STRING`",
											"kind": "query",
											"example": "2020..2026",
										},
									},
								},
								"select": map[string]any{},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/statistics/{id}",
								"segments": []any{
									map[string]any{
										"lit": "statistics",
									},
									map[string]any{
										"var": "id",
									},
								},
								"parts": []any{
									"statistics",
									"{id}",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "id",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
											"example": "stat_01M2HY9T5WMAQVXEKJ4XAX4XNG",
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
									},
								},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
		},
	}
}

// The plugin definitions the model selected per feature, as []any so a
// feature package can consume them without core naming its types. Empty
// when no active feature declares active plugin groups for this target.
var featurePlugins = map[string][]any{
}

// FeaturePlugins is the definitions list for one feature's chain.
func FeaturePlugins(name string) []any {
	return featurePlugins[name]
}

var (
	sharedConfigOnce sync.Once
	sharedConfigVal  map[string]any
)

// SharedConfig returns the process-wide config, built once on first use.
// The SDK reads the config on every request and never writes to it, so one
// instance is shared by every client rather than rebuilt per client.
//
// The returned map is shared: treat it as read-only. Callers that need to
// mutate should use MakeConfig, which always returns a fresh copy.
func SharedConfig() map[string]any {
	sharedConfigOnce.Do(func() {
		sharedConfigVal = MakeConfig()
	})
	return sharedConfigVal
}

func makeFeature(name string) Feature {
	switch name {
	case "ratelimit":
		if NewRatelimitFeatureFunc != nil {
			return NewRatelimitFeatureFunc()
		}
	case "retry":
		if NewRetryFeatureFunc != nil {
			return NewRetryFeatureFunc()
		}
	case "test":
		if NewTestFeatureFunc != nil {
			return NewTestFeatureFunc()
		}
	case "timeout":
		if NewTimeoutFeatureFunc != nil {
			return NewTimeoutFeatureFunc()
		}
	default:
		if NewBaseFeatureFunc != nil {
			return NewBaseFeatureFunc()
		}
	}
	return nil
}
