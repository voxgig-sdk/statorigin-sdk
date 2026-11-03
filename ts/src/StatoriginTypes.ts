// Typed models for the Statorigin SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.

export interface Indicator {
  definition?: string
  id?: string
  name?: string
  slug?: string
  unit?: string
}

export interface IndicatorLoadMatch {
  id: string

  // Selects a custom action instead of the plain load:
  //   'series'
  // The remaining keys are that action's own payload.
  $action?: string
  [action: string]: any
}

export interface IndicatorListMatch {
  industry?: string
  q?: string
}

export interface Industry {
  id?: string
  isic?: string
  level?: number
  name?: string
  parent_id?: string
  slug?: string
}

export interface IndustryLoadMatch {
  id: string
}

export interface IndustryListMatch {
  level?: number
  parent?: string
}

export interface Region {
  data?: any[]
  meta?: Record<string, any>
}

export interface RegionListMatch {
  type?: string
}

export interface Search {
}

export interface SearchLoadMatch {
  limit?: number
  q: string
}

export interface Source {
  id?: string
  name?: string
  short_name?: string
  slug?: string
  tier?: number
  type?: string
}

export interface SourceLoadMatch {
  id: string
  limit?: number
}

export interface SourceListMatch {
  tier?: number
}

export interface Statistic {
  citation: Record<string, any>
  confidence?: number | null
  currency?: string | null
  id: string
  indicator: Record<string, any>
  industry?: any[]
  is_current?: boolean
  is_secondhand?: boolean
  period: Record<string, any>
  region: Record<string, any>
  scale?: string
  source: Record<string, any>
  superseded_by?: string | null
  supersedes?: string | null
  unit: string
  updated_at?: string
  url: string
  value: number
  value_text?: string | null
  value_type?: string
  verification?: string
  verified_at?: string | null
  verified_by?: string | null
}

export interface StatisticLoadMatch {
  id: string
}

export interface StatisticListMatch {
  cursor?: string
  indicator?: string
  industry?: string
  limit?: number
  region?: string
  source_org?: string
  value_type?: string
  year?: string
}

