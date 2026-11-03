<?php
declare(strict_types=1);

// Statorigin SDK configuration

class StatoriginConfig
{
    /** @var array<string,mixed>|null */
    private static ?array $shared_config = null;

    /**
     * Return the process-wide config, built once on first use. The SDK reads
     * the config on every request and never writes to it, so one instance is
     * shared by every client rather than rebuilt per client.
     *
     * PHP arrays are copy-on-write, so callers that do mutate the result get
     * their own copy and cannot disturb the shared one.
     */
    public static function shared_config(): array
    {
        if (self::$shared_config === null) {
            self::$shared_config = self::make_config();
        }
        return self::$shared_config;
    }

    /**
     * Build a fresh, fully materialised config array. Every call rebuilds the
     * whole structure, so prefer shared_config unless you need a private copy.
     */
    public static function make_config(): array
    {
        return [
            "main" => [
                "name" => "Statorigin",
                "slug" => "statorigin",
                "version" => "0.0.1",
                "target" => "php",
            ],
            "feature" => [
                "ratelimit" => [
          'options' => [
            'active' => false,
            'burst' => 5,
            'rate' => 5,
          ],
          'optspec' => [
            'now' => '`$FUNCTION`',
            'sleep' => '`$FUNCTION`',
          ],
          'strict' => false,
          'transport' => 'wrap',
        ],
                "retry" => [
          'options' => [
            'active' => false,
            'factor' => 2,
            'maxDelay' => 2000,
            'minDelay' => 50,
            'retries' => 2,
            'statuses' => [
              408,
              425,
              429,
              500,
              502,
              503,
              504,
            ],
          ],
          'optspec' => [
            'jitter' => '`$BOOLEAN`',
            'sleep' => '`$FUNCTION`',
          ],
          'strict' => false,
          'transport' => 'wrap',
        ],
                "test" => [
          'options' => [
            'active' => false,
          ],
          'optspec' => [
            'entity' => '`$MAP`',
            'net' => '`$MAP`',
          ],
          'strict' => false,
          'transport' => 'base',
        ],
                "timeout" => [
          'options' => [
            'active' => false,
            'ms' => 30000,
          ],
          'optspec' => [
            'clearTimer' => '`$FUNCTION`',
            'now' => '`$FUNCTION`',
            'setTimer' => '`$FUNCTION`',
          ],
          'strict' => false,
          'transport' => 'wrap',
        ],
            ],
            "options" => [
                "base" => "https://statorigin.org/api/v1",
                "headers" => [
          'content-type' => 'application/json',
        ],
                "entity" => [
                    "indicator" => [],
                    "industry" => [],
                    "region" => [],
                    "search" => [],
                    "source" => [],
                    "statistic" => [],
                ],
            ],
            "entity" => [
        'indicator' => [
          'fields' => [
            [
              'name' => 'definition',
              'title' => 'Definition',
              'type' => '`$STRING`',
            ],
            [
              'name' => 'id',
              'title' => 'Id',
              'type' => '`$STRING`',
              'short' => 'Stable prefixed identifier.',
            ],
            [
              'name' => 'name',
              'title' => 'Name',
              'type' => '`$STRING`',
            ],
            [
              'name' => 'slug',
              'title' => 'Slug',
              'type' => '`$STRING`',
              'short' => 'URL key: the item routes take this.',
            ],
            [
              'name' => 'unit',
              'title' => 'Unit',
              'type' => '`$STRING`',
            ],
          ],
          'id' => [
            'field' => 'slug',
            'name' => 'id',
          ],
          'name' => 'indicator',
          'op' => [
            'list' => [
              'input' => 'data',
              'name' => 'list',
              'points' => [
                [
                  'kind' => 'http',
                  'method' => 'GET',
                  'orig' => '/indicators',
                  'segments' => [
                    [
                      'lit' => 'indicators',
                    ],
                  ],
                  'parts' => [
                    'indicators',
                  ],
                  'rename' => [],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body.data`',
                  ],
                  'args' => [
                    'query' => [
                      [
                        'name' => 'industry',
                        'orig' => 'industry',
                        'type' => '`$STRING`',
                        'kind' => 'query',
                      ],
                      [
                        'name' => 'q',
                        'orig' => 'q',
                        'type' => '`$STRING`',
                        'kind' => 'query',
                      ],
                    ],
                  ],
                  'select' => [],
                  'response' => [
                    'kind' => 'json',
                    'media' => 'application/json',
                  ],
                  'alias' => [
                    'id' => 'slug',
                  ],
                ],
              ],
            ],
            'load' => [
              'input' => 'data',
              'name' => 'load',
              'points' => [
                [
                  'kind' => 'http',
                  'method' => 'GET',
                  'orig' => '/indicators/{slug}',
                  'segments' => [
                    [
                      'lit' => 'indicators',
                    ],
                    [
                      'var' => 'id',
                    ],
                  ],
                  'parts' => [
                    'indicators',
                    '{id}',
                  ],
                  'rename' => [
                    'param' => [
                      'slug' => 'id',
                    ],
                  ],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body.data`',
                  ],
                  'args' => [
                    'params' => [
                      [
                        'name' => 'id',
                        'orig' => 'slug',
                        'type' => '`$STRING`',
                        'kind' => 'param',
                        'reqd' => true,
                        'example' => 'global-ev-annual-sales',
                      ],
                    ],
                  ],
                  'select' => [
                    'exist' => [
                      'id',
                    ],
                  ],
                  'response' => [
                    'kind' => 'json',
                    'media' => 'application/json',
                  ],
                  'alias' => [
                    'id' => 'slug',
                  ],
                ],
                [
                  'kind' => 'http',
                  'method' => 'GET',
                  'orig' => '/indicators/{slug}/series',
                  'segments' => [
                    [
                      'lit' => 'indicators',
                    ],
                    [
                      'var' => 'slug',
                    ],
                    [
                      'lit' => 'series',
                    ],
                  ],
                  'parts' => [
                    'indicators',
                    '{slug}',
                    'series',
                  ],
                  'rename' => [],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body.data`',
                  ],
                  'args' => [
                    'params' => [
                      [
                        'name' => 'slug',
                        'orig' => 'slug',
                        'type' => '`$STRING`',
                        'kind' => 'param',
                        'reqd' => true,
                        'example' => 'global-ev-annual-sales',
                      ],
                    ],
                    'query' => [
                      [
                        'name' => 'from',
                        'orig' => 'from',
                        'type' => '`$INTEGER`',
                        'kind' => 'query',
                        'example' => 2015,
                      ],
                      [
                        'name' => 'region',
                        'orig' => 'region',
                        'type' => '`$STRING`',
                        'kind' => 'query',
                      ],
                      [
                        'name' => 'to',
                        'orig' => 'to',
                        'type' => '`$INTEGER`',
                        'kind' => 'query',
                        'example' => 2026,
                      ],
                    ],
                  ],
                  'select' => [
                    '$action' => 'series',
                    'exist' => [
                      'slug',
                    ],
                  ],
                  'response' => [
                    'kind' => 'json',
                    'media' => 'application/json',
                  ],
                  'alias' => [
                    'id' => 'slug',
                  ],
                ],
              ],
            ],
          ],
          'relations' => [
            'ancestors' => [],
          ],
        ],
        'industry' => [
          'fields' => [
            [
              'name' => 'id',
              'title' => 'Id',
              'type' => '`$STRING`',
              'short' => 'Stable prefixed identifier.',
            ],
            [
              'name' => 'isic',
              'title' => 'Isic',
              'type' => '`$STRING`',
            ],
            [
              'name' => 'level',
              'title' => 'Level',
              'type' => '`$INTEGER`',
            ],
            [
              'name' => 'name',
              'title' => 'Name',
              'type' => '`$STRING`',
            ],
            [
              'name' => 'parent_id',
              'title' => 'Parent Id',
              'type' => '`$STRING`',
            ],
            [
              'name' => 'slug',
              'title' => 'Slug',
              'type' => '`$STRING`',
              'short' => 'URL key: the item routes take this.',
            ],
          ],
          'id' => [
            'field' => 'slug',
            'name' => 'id',
          ],
          'name' => 'industry',
          'op' => [
            'list' => [
              'input' => 'data',
              'name' => 'list',
              'points' => [
                [
                  'kind' => 'http',
                  'method' => 'GET',
                  'orig' => '/industries',
                  'segments' => [
                    [
                      'lit' => 'industries',
                    ],
                  ],
                  'parts' => [
                    'industries',
                  ],
                  'rename' => [],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body.data`',
                  ],
                  'args' => [
                    'query' => [
                      [
                        'name' => 'level',
                        'orig' => 'level',
                        'type' => '`$INTEGER`',
                        'kind' => 'query',
                        'field' => true,
                      ],
                      [
                        'name' => 'parent',
                        'orig' => 'parent',
                        'type' => '`$STRING`',
                        'kind' => 'query',
                        'example' => 'C',
                      ],
                    ],
                  ],
                  'select' => [],
                  'response' => [
                    'kind' => 'json',
                    'media' => 'application/json',
                  ],
                  'alias' => [
                    'id' => 'slug',
                  ],
                ],
              ],
            ],
            'load' => [
              'input' => 'data',
              'name' => 'load',
              'points' => [
                [
                  'kind' => 'http',
                  'method' => 'GET',
                  'orig' => '/industries/{slug}',
                  'segments' => [
                    [
                      'lit' => 'industries',
                    ],
                    [
                      'var' => 'id',
                    ],
                  ],
                  'parts' => [
                    'industries',
                    '{id}',
                  ],
                  'rename' => [
                    'param' => [
                      'slug' => 'id',
                    ],
                  ],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body.data`',
                  ],
                  'args' => [
                    'params' => [
                      [
                        'name' => 'id',
                        'orig' => 'slug',
                        'type' => '`$STRING`',
                        'kind' => 'param',
                        'reqd' => true,
                        'example' => 'electric-vehicles',
                      ],
                    ],
                  ],
                  'select' => [
                    'exist' => [
                      'id',
                    ],
                  ],
                  'response' => [
                    'kind' => 'json',
                    'media' => 'application/json',
                  ],
                  'alias' => [
                    'id' => 'slug',
                  ],
                ],
              ],
            ],
          ],
          'relations' => [
            'ancestors' => [],
          ],
        ],
        'region' => [
          'fields' => [
            [
              'name' => 'data',
              'title' => 'Data',
              'type' => '`$ARRAY`',
            ],
            [
              'name' => 'meta',
              'title' => 'Meta',
              'type' => '`$OBJECT`',
            ],
          ],
          'name' => 'region',
          'op' => [
            'list' => [
              'input' => 'data',
              'name' => 'list',
              'points' => [
                [
                  'kind' => 'http',
                  'method' => 'GET',
                  'orig' => '/regions',
                  'segments' => [
                    [
                      'lit' => 'regions',
                    ],
                  ],
                  'parts' => [
                    'regions',
                  ],
                  'rename' => [],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body.data`',
                  ],
                  'args' => [
                    'query' => [
                      [
                        'name' => 'type',
                        'orig' => 'type',
                        'type' => '`$STRING`',
                        'kind' => 'query',
                      ],
                    ],
                  ],
                  'select' => [],
                  'response' => [
                    'kind' => 'json',
                    'media' => 'application/json',
                  ],
                ],
              ],
            ],
          ],
          'relations' => [
            'ancestors' => [],
          ],
        ],
        'search' => [
          'fields' => [],
          'name' => 'search',
          'op' => [
            'load' => [
              'input' => 'data',
              'name' => 'load',
              'points' => [
                [
                  'kind' => 'http',
                  'method' => 'GET',
                  'orig' => '/search',
                  'segments' => [
                    [
                      'lit' => 'search',
                    ],
                  ],
                  'parts' => [
                    'search',
                  ],
                  'rename' => [],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body.data`',
                  ],
                  'args' => [
                    'query' => [
                      [
                        'name' => 'limit',
                        'orig' => 'limit',
                        'type' => '`$INTEGER`',
                        'kind' => 'query',
                        'example' => 25,
                      ],
                      [
                        'name' => 'q',
                        'orig' => 'q',
                        'type' => '`$STRING`',
                        'kind' => 'query',
                        'reqd' => true,
                        'example' => 'electric',
                      ],
                    ],
                  ],
                  'select' => [
                    'exist' => [
                      'q',
                    ],
                  ],
                  'response' => [
                    'kind' => 'json',
                    'media' => 'application/json',
                  ],
                ],
              ],
            ],
          ],
          'relations' => [
            'ancestors' => [],
          ],
        ],
        'source' => [
          'fields' => [
            [
              'name' => 'id',
              'title' => 'Id',
              'type' => '`$STRING`',
              'short' => 'Stable prefixed identifier.',
            ],
            [
              'name' => 'name',
              'title' => 'Name',
              'type' => '`$STRING`',
            ],
            [
              'name' => 'short_name',
              'title' => 'Short Name',
              'type' => '`$STRING`',
            ],
            [
              'name' => 'slug',
              'title' => 'Slug',
              'type' => '`$STRING`',
              'short' => 'URL key: the item routes take this.',
            ],
            [
              'name' => 'tier',
              'title' => 'Tier',
              'type' => '`$INTEGER`',
            ],
            [
              'name' => 'type',
              'title' => 'Type',
              'type' => '`$STRING`',
            ],
          ],
          'id' => [
            'field' => 'slug',
            'name' => 'id',
          ],
          'name' => 'source',
          'op' => [
            'list' => [
              'input' => 'data',
              'name' => 'list',
              'points' => [
                [
                  'kind' => 'http',
                  'method' => 'GET',
                  'orig' => '/sources',
                  'segments' => [
                    [
                      'lit' => 'sources',
                    ],
                  ],
                  'parts' => [
                    'sources',
                  ],
                  'rename' => [],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body.data`',
                  ],
                  'args' => [
                    'query' => [
                      [
                        'name' => 'tier',
                        'orig' => 'tier',
                        'type' => '`$INTEGER`',
                        'kind' => 'query',
                        'field' => true,
                      ],
                    ],
                  ],
                  'select' => [],
                  'response' => [
                    'kind' => 'json',
                    'media' => 'application/json',
                  ],
                  'alias' => [
                    'id' => 'slug',
                  ],
                ],
              ],
            ],
            'load' => [
              'input' => 'data',
              'name' => 'load',
              'points' => [
                [
                  'kind' => 'http',
                  'method' => 'GET',
                  'orig' => '/sources/{slug}',
                  'segments' => [
                    [
                      'lit' => 'sources',
                    ],
                    [
                      'var' => 'id',
                    ],
                  ],
                  'parts' => [
                    'sources',
                    '{id}',
                  ],
                  'rename' => [
                    'param' => [
                      'slug' => 'id',
                    ],
                  ],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body.data`',
                  ],
                  'args' => [
                    'params' => [
                      [
                        'name' => 'id',
                        'orig' => 'slug',
                        'type' => '`$STRING`',
                        'kind' => 'param',
                        'reqd' => true,
                        'example' => 'international-energy-agency',
                      ],
                    ],
                    'query' => [
                      [
                        'name' => 'limit',
                        'orig' => 'limit',
                        'type' => '`$INTEGER`',
                        'kind' => 'query',
                        'example' => 100,
                      ],
                    ],
                  ],
                  'select' => [
                    'exist' => [
                      'id',
                    ],
                  ],
                  'response' => [
                    'kind' => 'json',
                    'media' => 'application/json',
                  ],
                  'alias' => [
                    'id' => 'slug',
                  ],
                ],
              ],
            ],
          ],
          'relations' => [
            'ancestors' => [],
          ],
        ],
        'statistic' => [
          'fields' => [
            [
              'name' => 'citation',
              'title' => 'Citation',
              'type' => '`$OBJECT`',
              'req' => true,
            ],
            [
              'name' => 'confidence',
              'title' => 'Confidence',
              'type' => [
                '`$ONE`',
                [
                  '`$NUMBER`',
                  '`$NULL`',
                ],
              ],
            ],
            [
              'name' => 'currency',
              'title' => 'Currency',
              'type' => [
                '`$ONE`',
                [
                  '`$STRING`',
                  '`$NULL`',
                ],
              ],
            ],
            [
              'name' => 'id',
              'title' => 'Id',
              'type' => '`$STRING`',
              'req' => true,
            ],
            [
              'name' => 'indicator',
              'title' => 'Indicator',
              'type' => '`$OBJECT`',
              'req' => true,
            ],
            [
              'name' => 'industry',
              'title' => 'Industry',
              'type' => '`$ARRAY`',
            ],
            [
              'name' => 'is_current',
              'title' => 'Is Current',
              'type' => '`$BOOLEAN`',
              'short' => 'False once superseded_by is set',
            ],
            [
              'name' => 'is_secondhand',
              'title' => 'Is Secondhand',
              'type' => '`$BOOLEAN`',
              'short' => 'True when the figure was relayed from a secondary source',
            ],
            [
              'name' => 'period',
              'title' => 'Period',
              'type' => '`$OBJECT`',
              'req' => true,
            ],
            [
              'name' => 'region',
              'title' => 'Region',
              'type' => '`$OBJECT`',
              'req' => true,
            ],
            [
              'name' => 'scale',
              'title' => 'Scale',
              'type' => '`$STRING`',
            ],
            [
              'name' => 'source',
              'title' => 'Source',
              'type' => '`$OBJECT`',
              'req' => true,
              'short' => 'Complete provenance.',
            ],
            [
              'name' => 'superseded_by',
              'title' => 'Superseded By',
              'type' => [
                '`$ONE`',
                [
                  '`$STRING`',
                  '`$NULL`',
                ],
              ],
              'short' => 'Id of the newer record that corrected this one.',
            ],
            [
              'name' => 'supersedes',
              'title' => 'Supersedes',
              'type' => [
                '`$ONE`',
                [
                  '`$STRING`',
                  '`$NULL`',
                ],
              ],
              'short' => 'Id of the older record this one corrected, if any',
            ],
            [
              'name' => 'unit',
              'title' => 'Unit',
              'type' => '`$STRING`',
              'req' => true,
            ],
            [
              'name' => 'updated_at',
              'title' => 'Updated At',
              'type' => '`$STRING`',
              'format' => 'date-time',
            ],
            [
              'name' => 'url',
              'title' => 'Url',
              'type' => '`$STRING`',
              'req' => true,
              'format' => 'uri',
            ],
            [
              'name' => 'value',
              'title' => 'Value',
              'type' => '`$NUMBER`',
              'req' => true,
            ],
            [
              'name' => 'value_text',
              'title' => 'Value Text',
              'type' => [
                '`$ONE`',
                [
                  '`$STRING`',
                  '`$NULL`',
                ],
              ],
              'short' => 'The source\'s own phrasing, preserved verbatim',
            ],
            [
              'name' => 'value_type',
              'title' => 'Value Type',
              'type' => '`$STRING`',
            ],
            [
              'name' => 'verification',
              'title' => 'Verification',
              'type' => '`$STRING`',
            ],
            [
              'name' => 'verified_at',
              'title' => 'Verified At',
              'type' => [
                '`$ONE`',
                [
                  '`$STRING`',
                  '`$NULL`',
                ],
              ],
              'format' => 'date-time',
            ],
            [
              'name' => 'verified_by',
              'title' => 'Verified By',
              'type' => [
                '`$ONE`',
                [
                  '`$STRING`',
                  '`$NULL`',
                ],
              ],
            ],
          ],
          'id' => [
            'field' => 'id',
            'name' => 'id',
          ],
          'name' => 'statistic',
          'op' => [
            'list' => [
              'input' => 'data',
              'name' => 'list',
              'points' => [
                [
                  'kind' => 'http',
                  'method' => 'GET',
                  'orig' => '/statistics',
                  'segments' => [
                    [
                      'lit' => 'statistics',
                    ],
                  ],
                  'parts' => [
                    'statistics',
                  ],
                  'rename' => [],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body.data`',
                  ],
                  'args' => [
                    'query' => [
                      [
                        'name' => 'cursor',
                        'orig' => 'cursor',
                        'type' => '`$STRING`',
                        'kind' => 'query',
                      ],
                      [
                        'name' => 'indicator',
                        'orig' => 'indicator',
                        'type' => '`$STRING`',
                        'kind' => 'query',
                        'example' => 'global-ev-annual-sales',
                        'field' => true,
                      ],
                      [
                        'name' => 'industry',
                        'orig' => 'industry',
                        'type' => '`$STRING`',
                        'kind' => 'query',
                        'example' => 'electric-vehicles',
                        'field' => true,
                      ],
                      [
                        'name' => 'limit',
                        'orig' => 'limit',
                        'type' => '`$INTEGER`',
                        'kind' => 'query',
                        'example' => 50,
                      ],
                      [
                        'name' => 'region',
                        'orig' => 'region',
                        'type' => '`$STRING`',
                        'kind' => 'query',
                        'example' => 'CN,US',
                        'field' => true,
                      ],
                      [
                        'name' => 'source_org',
                        'orig' => 'source_org',
                        'type' => '`$STRING`',
                        'kind' => 'query',
                        'example' => 'international-energy-agency',
                      ],
                      [
                        'name' => 'value_type',
                        'orig' => 'value_type',
                        'type' => '`$STRING`',
                        'kind' => 'query',
                        'field' => true,
                      ],
                      [
                        'name' => 'year',
                        'orig' => 'year',
                        'type' => '`$STRING`',
                        'kind' => 'query',
                        'example' => '2020..2026',
                      ],
                    ],
                  ],
                  'select' => [],
                  'response' => [
                    'kind' => 'json',
                    'media' => 'application/json',
                  ],
                ],
              ],
            ],
            'load' => [
              'input' => 'data',
              'name' => 'load',
              'points' => [
                [
                  'kind' => 'http',
                  'method' => 'GET',
                  'orig' => '/statistics/{id}',
                  'segments' => [
                    [
                      'lit' => 'statistics',
                    ],
                    [
                      'var' => 'id',
                    ],
                  ],
                  'parts' => [
                    'statistics',
                    '{id}',
                  ],
                  'rename' => [],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body.data`',
                  ],
                  'args' => [
                    'params' => [
                      [
                        'name' => 'id',
                        'orig' => 'id',
                        'type' => '`$STRING`',
                        'kind' => 'param',
                        'reqd' => true,
                        'example' => 'stat_01M2HY9T5WMAQVXEKJ4XAX4XNG',
                      ],
                    ],
                  ],
                  'select' => [
                    'exist' => [
                      'id',
                    ],
                  ],
                  'response' => [
                    'kind' => 'json',
                    'media' => 'application/json',
                  ],
                ],
              ],
            ],
          ],
          'relations' => [
            'ancestors' => [],
          ],
        ],
      ],
        ];
    }


    public static function make_feature(string $name)
    {
        require_once __DIR__ . '/features.php';
        return StatoriginFeatures::make_feature($name);
    }
}
