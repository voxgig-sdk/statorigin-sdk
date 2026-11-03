-- Typed models for the Statorigin SDK (LuaLS annotations).
--
-- GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
-- params (op.<name>.points[].g.params[]). Field/param types come from the
-- canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
-- @voxgig/apidef VALID_CANON). Annotations only — no runtime effect. Do not
-- edit by hand.

---@class Indicator
---@field definition? string
---@field id? string
---@field name? string
---@field slug? string
---@field unit? string

---@class IndicatorLoadMatch
---@field id string

---@class IndicatorListMatch
---@field industry? string
---@field q? string

---@class Industry
---@field id? string
---@field isic? string
---@field level? number
---@field name? string
---@field parent_id? string
---@field slug? string

---@class IndustryLoadMatch
---@field id string

---@class IndustryListMatch
---@field level? number
---@field parent? string

---@class Region
---@field data? table
---@field meta? table

---@class RegionListMatch
---@field type? string

---@class Search

---@class SearchLoadMatch
---@field limit? number
---@field q string

---@class Source
---@field id? string
---@field name? string
---@field short_name? string
---@field slug? string
---@field tier? number
---@field type? string

---@class SourceLoadMatch
---@field id string
---@field limit? number

---@class SourceListMatch
---@field tier? number

---@class Statistic
---@field citation table
---@field confidence? number|nil
---@field currency? string|nil
---@field id string
---@field indicator table
---@field industry? table
---@field is_current? boolean
---@field is_secondhand? boolean
---@field period table
---@field region table
---@field scale? string
---@field source table
---@field superseded_by? string|nil
---@field supersedes? string|nil
---@field unit string
---@field updated_at? string
---@field url string
---@field value number
---@field value_text? string|nil
---@field value_type? string
---@field verification? string
---@field verified_at? string|nil
---@field verified_by? string|nil

---@class StatisticLoadMatch
---@field id string

---@class StatisticListMatch
---@field cursor? string
---@field indicator? string
---@field industry? string
---@field limit? number
---@field region? string
---@field source_org? string
---@field value_type? string
---@field year? string

local M = {}

return M
