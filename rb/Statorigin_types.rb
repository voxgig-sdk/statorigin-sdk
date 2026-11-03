# frozen_string_literal: true

# Typed models for the Statorigin SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
# params (op.<name>.points[].g.params[]). Member types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Ruby types are unenforced; these YARD
# annotations document the shapes. Do not edit by hand.

# Indicator entity data model.
#
# @!attribute [rw] definition
#   @return [String, nil]
#
# @!attribute [rw] id
#   @return [String, nil]
#
# @!attribute [rw] name
#   @return [String, nil]
#
# @!attribute [rw] slug
#   @return [String, nil]
#
# @!attribute [rw] unit
#   @return [String, nil]
Indicator = Struct.new(
  :definition,
  :id,
  :name,
  :slug,
  :unit,
  keyword_init: true
)

# Request payload for Indicator#load.
#
# @!attribute [rw] id
#   @return [String]
IndicatorLoadMatch = Struct.new(
  :id,
  keyword_init: true
)

# Request payload for Indicator#list.
#
# @!attribute [rw] industry
#   @return [String, nil]
#
# @!attribute [rw] q
#   @return [String, nil]
IndicatorListMatch = Struct.new(
  :industry,
  :q,
  keyword_init: true
)

# Industry entity data model.
#
# @!attribute [rw] id
#   @return [String, nil]
#
# @!attribute [rw] isic
#   @return [String, nil]
#
# @!attribute [rw] level
#   @return [Integer, nil]
#
# @!attribute [rw] name
#   @return [String, nil]
#
# @!attribute [rw] parent_id
#   @return [String, nil]
#
# @!attribute [rw] slug
#   @return [String, nil]
Industry = Struct.new(
  :id,
  :isic,
  :level,
  :name,
  :parent_id,
  :slug,
  keyword_init: true
)

# Request payload for Industry#load.
#
# @!attribute [rw] id
#   @return [String]
IndustryLoadMatch = Struct.new(
  :id,
  keyword_init: true
)

# Request payload for Industry#list.
#
# @!attribute [rw] level
#   @return [Integer, nil]
#
# @!attribute [rw] parent
#   @return [String, nil]
IndustryListMatch = Struct.new(
  :level,
  :parent,
  keyword_init: true
)

# Region entity data model.
#
# @!attribute [rw] data
#   @return [Array, nil]
#
# @!attribute [rw] meta
#   @return [Hash, nil]
Region = Struct.new(
  :data,
  :meta,
  keyword_init: true
)

# Request payload for Region#list.
#
# @!attribute [rw] type
#   @return [String, nil]
RegionListMatch = Struct.new(
  :type,
  keyword_init: true
)

# Search entity data model.
class Search
end

# Request payload for Search#load.
#
# @!attribute [rw] limit
#   @return [Integer, nil]
#
# @!attribute [rw] q
#   @return [String]
SearchLoadMatch = Struct.new(
  :limit,
  :q,
  keyword_init: true
)

# Source entity data model.
#
# @!attribute [rw] id
#   @return [String, nil]
#
# @!attribute [rw] name
#   @return [String, nil]
#
# @!attribute [rw] short_name
#   @return [String, nil]
#
# @!attribute [rw] slug
#   @return [String, nil]
#
# @!attribute [rw] tier
#   @return [Integer, nil]
#
# @!attribute [rw] type
#   @return [String, nil]
Source = Struct.new(
  :id,
  :name,
  :short_name,
  :slug,
  :tier,
  :type,
  keyword_init: true
)

# Request payload for Source#load.
#
# @!attribute [rw] id
#   @return [String]
#
# @!attribute [rw] limit
#   @return [Integer, nil]
SourceLoadMatch = Struct.new(
  :id,
  :limit,
  keyword_init: true
)

# Request payload for Source#list.
#
# @!attribute [rw] tier
#   @return [Integer, nil]
SourceListMatch = Struct.new(
  :tier,
  keyword_init: true
)

# Statistic entity data model.
#
# @!attribute [rw] citation
#   @return [Hash]
#
# @!attribute [rw] confidence
#   @return [Object, nil]
#
# @!attribute [rw] currency
#   @return [Object, nil]
#
# @!attribute [rw] id
#   @return [String]
#
# @!attribute [rw] indicator
#   @return [Hash]
#
# @!attribute [rw] industry
#   @return [Array, nil]
#
# @!attribute [rw] is_current
#   @return [Boolean, nil]
#
# @!attribute [rw] is_secondhand
#   @return [Boolean, nil]
#
# @!attribute [rw] period
#   @return [Hash]
#
# @!attribute [rw] region
#   @return [Hash]
#
# @!attribute [rw] scale
#   @return [String, nil]
#
# @!attribute [rw] source
#   @return [Hash]
#
# @!attribute [rw] superseded_by
#   @return [Object, nil]
#
# @!attribute [rw] supersedes
#   @return [Object, nil]
#
# @!attribute [rw] unit
#   @return [String]
#
# @!attribute [rw] updated_at
#   @return [String, nil]
#
# @!attribute [rw] url
#   @return [String]
#
# @!attribute [rw] value
#   @return [Float]
#
# @!attribute [rw] value_text
#   @return [Object, nil]
#
# @!attribute [rw] value_type
#   @return [String, nil]
#
# @!attribute [rw] verification
#   @return [String, nil]
#
# @!attribute [rw] verified_at
#   @return [Object, nil]
#
# @!attribute [rw] verified_by
#   @return [Object, nil]
Statistic = Struct.new(
  :citation,
  :confidence,
  :currency,
  :id,
  :indicator,
  :industry,
  :is_current,
  :is_secondhand,
  :period,
  :region,
  :scale,
  :source,
  :superseded_by,
  :supersedes,
  :unit,
  :updated_at,
  :url,
  :value,
  :value_text,
  :value_type,
  :verification,
  :verified_at,
  :verified_by,
  keyword_init: true
)

# Request payload for Statistic#load.
#
# @!attribute [rw] id
#   @return [String]
StatisticLoadMatch = Struct.new(
  :id,
  keyword_init: true
)

# Request payload for Statistic#list.
#
# @!attribute [rw] cursor
#   @return [String, nil]
#
# @!attribute [rw] indicator
#   @return [String, nil]
#
# @!attribute [rw] industry
#   @return [String, nil]
#
# @!attribute [rw] limit
#   @return [Integer, nil]
#
# @!attribute [rw] region
#   @return [String, nil]
#
# @!attribute [rw] source_org
#   @return [String, nil]
#
# @!attribute [rw] value_type
#   @return [String, nil]
#
# @!attribute [rw] year
#   @return [String, nil]
StatisticListMatch = Struct.new(
  :cursor,
  :indicator,
  :industry,
  :limit,
  :region,
  :source_org,
  :value_type,
  :year,
  keyword_init: true
)

