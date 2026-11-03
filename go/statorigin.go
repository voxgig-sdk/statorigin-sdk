package voxgigstatoriginsdk

import (
	"github.com/voxgig-sdk/statorigin-sdk/go/core"
	"github.com/voxgig-sdk/statorigin-sdk/go/entity"
	"github.com/voxgig-sdk/statorigin-sdk/go/feature"
	_ "github.com/voxgig-sdk/statorigin-sdk/go/utility"
)

// Type aliases preserve external API.
type StatoriginSDK = core.StatoriginSDK
type Context = core.Context
type Utility = core.Utility
type Feature = core.Feature
type Entity = core.Entity
type StatoriginEntityBase = core.StatoriginEntityBase

// Deprecated: use StatoriginEntityBase.
type StatoriginEntity = core.StatoriginEntityBase

type StreamItem = core.StreamItem
type FetcherFunc = core.FetcherFunc
type Spec = core.Spec
type Result = core.Result
type Response = core.Response
type Operation = core.Operation
type Control = core.Control
type StatoriginError = core.StatoriginError

// BaseFeature from feature package.
type BaseFeature = feature.BaseFeature

func init() {
	core.NewBaseFeatureFunc = func() core.Feature {
		return feature.NewBaseFeature()
	}
	core.NewRatelimitFeatureFunc = func() core.Feature {
		return feature.NewRatelimitFeature()
	}
	core.NewRetryFeatureFunc = func() core.Feature {
		return feature.NewRetryFeature()
	}
	core.NewTestFeatureFunc = func() core.Feature {
		return feature.NewTestFeature()
	}
	core.NewTimeoutFeatureFunc = func() core.Feature {
		return feature.NewTimeoutFeature()
	}
	core.NewIndicatorEntityFunc = func(client *core.StatoriginSDK, entopts map[string]any) core.StatoriginEntityBase {
		return entity.NewIndicatorEntity(client, entopts)
	}
	core.NewIndustryEntityFunc = func(client *core.StatoriginSDK, entopts map[string]any) core.StatoriginEntityBase {
		return entity.NewIndustryEntity(client, entopts)
	}
	core.NewRegionEntityFunc = func(client *core.StatoriginSDK, entopts map[string]any) core.StatoriginEntityBase {
		return entity.NewRegionEntity(client, entopts)
	}
	core.NewSearchEntityFunc = func(client *core.StatoriginSDK, entopts map[string]any) core.StatoriginEntityBase {
		return entity.NewSearchEntity(client, entopts)
	}
	core.NewSourceEntityFunc = func(client *core.StatoriginSDK, entopts map[string]any) core.StatoriginEntityBase {
		return entity.NewSourceEntity(client, entopts)
	}
	core.NewStatisticEntityFunc = func(client *core.StatoriginSDK, entopts map[string]any) core.StatoriginEntityBase {
		return entity.NewStatisticEntity(client, entopts)
	}
}

// Constructor re-exports.
var NewStatoriginSDK = core.NewStatoriginSDK
var TestSDK = core.TestSDK
var NewContext = core.NewContext
var NewSpec = core.NewSpec
var NewResult = core.NewResult
var NewResponse = core.NewResponse
var NewOperation = core.NewOperation
var MakeConfig = core.MakeConfig
var SharedConfig = core.SharedConfig

// No-arg convenience constructors. Go has no default-argument syntax,
// so these aliases let callers write `sdk.New()` / `sdk.Test()`
// instead of `sdk.NewStatoriginSDK(nil)` / `sdk.TestSDK(nil, nil)`
// for the common no-options case.
func New() *StatoriginSDK  { return NewStatoriginSDK(nil) }
func Test() *StatoriginSDK { return TestSDK(nil, nil) }
var NewBaseFeature = feature.NewBaseFeature
var NewRatelimitFeature = feature.NewRatelimitFeature
var NewRetryFeature = feature.NewRetryFeature
var NewTestFeature = feature.NewTestFeature
var NewTimeoutFeature = feature.NewTimeoutFeature
