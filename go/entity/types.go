// Typed models for the Statorigin SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
package entity

import (
	"encoding/json"

	"github.com/voxgig-sdk/statorigin-sdk/go/core"
)

// Indicator is the typed data model for the indicator entity.
type Indicator struct {
}

// IndicatorLoadMatch is the typed request payload for Indicator.LoadTyped.
type IndicatorLoadMatch struct {
	Id string `json:"id"`
}

// IndicatorListMatch is the typed request payload for Indicator.ListTyped.
type IndicatorListMatch struct {
	Industry *string `json:"industry,omitempty"`
	Q *string `json:"q,omitempty"`
}

// Industry is the typed data model for the industry entity.
type Industry struct {
}

// IndustryLoadMatch is the typed request payload for Industry.LoadTyped.
type IndustryLoadMatch struct {
	Id string `json:"id"`
}

// IndustryListMatch is the typed request payload for Industry.ListTyped.
type IndustryListMatch struct {
	Level *int `json:"level,omitempty"`
	Parent *string `json:"parent,omitempty"`
}

// Region is the typed data model for the region entity.
type Region struct {
}

// RegionListMatch is the typed request payload for Region.ListTyped.
type RegionListMatch struct {
	Type *string `json:"type,omitempty"`
}

// Search is the typed data model for the search entity.
type Search struct {
}

// SearchLoadMatch is the typed request payload for Search.LoadTyped.
type SearchLoadMatch struct {
	Limit *int `json:"limit,omitempty"`
	Q string `json:"q"`
}

// Source is the typed data model for the source entity.
type Source struct {
}

// SourceLoadMatch is the typed request payload for Source.LoadTyped.
type SourceLoadMatch struct {
	Id string `json:"id"`
	Limit *int `json:"limit,omitempty"`
}

// SourceListMatch is the typed request payload for Source.ListTyped.
type SourceListMatch struct {
	Tier *int `json:"tier,omitempty"`
}

// Statistic is the typed data model for the statistic entity.
type Statistic struct {
}

// StatisticLoadMatch is the typed request payload for Statistic.LoadTyped.
type StatisticLoadMatch struct {
	Id string `json:"id"`
}

// StatisticListMatch is the typed request payload for Statistic.ListTyped.
type StatisticListMatch struct {
	Cursor *string `json:"cursor,omitempty"`
	Indicator *string `json:"indicator,omitempty"`
	Industry *string `json:"industry,omitempty"`
	Limit *int `json:"limit,omitempty"`
	Region *string `json:"region,omitempty"`
	SourceOrg *string `json:"source_org,omitempty"`
	ValueType *string `json:"value_type,omitempty"`
	Year *string `json:"year,omitempty"`
}

// asMap turns a typed request/data struct into the map[string]any the
// runtime op pipeline consumes, honouring the json tags above.
func asMap(v any) map[string]any {
	out := map[string]any{}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}

// entityData unwraps an entity to its data map.
//
// Operations resolve to the ENTITY, not the raw data (see AGENTS.md), and an
// entity's fields are UNEXPORTED — marshalling one directly yields `{}`, so
// every typed accessor would silently hand back a zero-valued struct. The
// typed boundary therefore takes the data hop first.
func entityData(v any) any {
	if ent, ok := v.(core.Entity); ok {
		return ent.Data()
	}
	return v
}

// typedFrom decodes a runtime value (an entity, or the map[string]any the op
// pipeline produced) into a typed model T via a JSON round-trip. On any error
// it returns the zero value of T; the op's own (value, error) tuple carries
// the real error.
func typedFrom[T any](v any) T {
	var out T
	v = entityData(v)
	if v == nil {
		return out
	}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}

// typedSliceFrom decodes a runtime list value into a typed slice []T via a
// JSON round-trip, for list ops. `list` resolves to a slice of ENTITY
// instances, so each element takes the data hop.
func typedSliceFrom[T any](v any) []T {
	var out []T
	if v == nil {
		return out
	}
	if list, ok := v.([]any); ok {
		unwrapped := make([]any, 0, len(list))
		for _, item := range list {
			unwrapped = append(unwrapped, entityData(item))
		}
		v = unwrapped
	}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}
