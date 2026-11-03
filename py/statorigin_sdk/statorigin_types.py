# Typed models for the Statorigin SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
# params (op.<name>.points[].g.params[]). Field/param types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Do not edit by hand.
#
# These are TypedDicts, not dataclasses: the SDK ops return/accept plain dicts
# at runtime, and a TypedDict IS a dict shape, so the types match the runtime.
# Optional (req:false) keys are modelled as TypedDict key-optionality
# (total=False), split into a required base + total=False subclass when a type
# has both required and optional keys.

from __future__ import annotations

from typing import TypedDict, Any


class Indicator(TypedDict, total=False):
    definition: str
    id: str
    name: str
    slug: str
    unit: str


class IndicatorLoadMatch(TypedDict):
    id: str


class IndicatorListMatch(TypedDict, total=False):
    industry: str
    q: str


class Industry(TypedDict, total=False):
    id: str
    isic: str
    level: int
    name: str
    parent_id: str
    slug: str


class IndustryLoadMatch(TypedDict):
    id: str


class IndustryListMatch(TypedDict, total=False):
    level: int
    parent: str


class Region(TypedDict, total=False):
    data: list
    meta: dict


class RegionListMatch(TypedDict, total=False):
    type: str


class Search(TypedDict):
    pass


class SearchLoadMatchRequired(TypedDict):
    q: str


class SearchLoadMatch(SearchLoadMatchRequired, total=False):
    limit: int


class Source(TypedDict, total=False):
    id: str
    name: str
    short_name: str
    slug: str
    tier: int
    type: str


class SourceLoadMatchRequired(TypedDict):
    id: str


class SourceLoadMatch(SourceLoadMatchRequired, total=False):
    limit: int


class SourceListMatch(TypedDict, total=False):
    tier: int


class StatisticRequired(TypedDict):
    citation: dict
    id: str
    indicator: dict
    period: dict
    region: dict
    source: dict
    unit: str
    url: str
    value: float


class Statistic(StatisticRequired, total=False):
    confidence: float | None
    currency: str | None
    industry: list
    is_current: bool
    is_secondhand: bool
    scale: str
    superseded_by: str | None
    supersedes: str | None
    updated_at: str
    value_text: str | None
    value_type: str
    verification: str
    verified_at: str | None
    verified_by: str | None


class StatisticLoadMatch(TypedDict):
    id: str


class StatisticListMatch(TypedDict, total=False):
    cursor: str
    indicator: str
    industry: str
    limit: int
    region: str
    source_org: str
    value_type: str
    year: str
