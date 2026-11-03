<?php
declare(strict_types=1);

// Typed models for the Statorigin SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
//
// These are documentation-grade value objects (PHP 8 typed properties),
// registered on the composer classmap autoload. The SDK boundary exchanges
// assoc-arrays; these classes name the shapes for tooling and typed callers.

/** Indicator entity data model. */
class Indicator
{
    public ?string $definition = null;
    public ?string $id = null;
    public ?string $name = null;
    public ?string $slug = null;
    public ?string $unit = null;
}

/** Request payload for Indicator#load. */
class IndicatorLoadMatch
{
    public string $id;
}

/** Request payload for Indicator#list. */
class IndicatorListMatch
{
    public ?string $industry = null;
    public ?string $q = null;
}

/** Industry entity data model. */
class Industry
{
    public ?string $id = null;
    public ?string $isic = null;
    public ?int $level = null;
    public ?string $name = null;
    public ?string $parent_id = null;
    public ?string $slug = null;
}

/** Request payload for Industry#load. */
class IndustryLoadMatch
{
    public string $id;
}

/** Request payload for Industry#list. */
class IndustryListMatch
{
    public ?int $level = null;
    public ?string $parent = null;
}

/** Region entity data model. */
class Region
{
    public ?array $data = null;
    public ?array $meta = null;
}

/** Request payload for Region#list. */
class RegionListMatch
{
    public ?string $type = null;
}

/** Search entity data model. */
class Search
{
}

/** Request payload for Search#load. */
class SearchLoadMatch
{
    public ?int $limit = null;
    public string $q;
}

/** Source entity data model. */
class Source
{
    public ?string $id = null;
    public ?string $name = null;
    public ?string $short_name = null;
    public ?string $slug = null;
    public ?int $tier = null;
    public ?string $type = null;
}

/** Request payload for Source#load. */
class SourceLoadMatch
{
    public string $id;
    public ?int $limit = null;
}

/** Request payload for Source#list. */
class SourceListMatch
{
    public ?int $tier = null;
}

/** Statistic entity data model. */
class Statistic
{
    public array $citation;
    public mixed $confidence = null;
    public mixed $currency = null;
    public string $id;
    public array $indicator;
    public ?array $industry = null;
    public ?bool $is_current = null;
    public ?bool $is_secondhand = null;
    public array $period;
    public array $region;
    public ?string $scale = null;
    public array $source;
    public mixed $superseded_by = null;
    public mixed $supersedes = null;
    public string $unit;
    public ?string $updated_at = null;
    public string $url;
    public float $value;
    public mixed $value_text = null;
    public ?string $value_type = null;
    public ?string $verification = null;
    public mixed $verified_at = null;
    public mixed $verified_by = null;
}

/** Request payload for Statistic#load. */
class StatisticLoadMatch
{
    public string $id;
}

/** Request payload for Statistic#list. */
class StatisticListMatch
{
    public ?string $cursor = null;
    public ?string $indicator = null;
    public ?string $industry = null;
    public ?int $limit = null;
    public ?string $region = null;
    public ?string $source_org = null;
    public ?string $value_type = null;
    public ?string $year = null;
}

