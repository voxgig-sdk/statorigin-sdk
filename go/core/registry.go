package core

var UtilityRegistrar func(u *Utility)

var NewBaseFeatureFunc func() Feature

var NewRatelimitFeatureFunc func() Feature

var NewRetryFeatureFunc func() Feature

var NewTestFeatureFunc func() Feature

var NewTimeoutFeatureFunc func() Feature

var NewIndicatorEntityFunc func(client *StatoriginSDK, entopts map[string]any) StatoriginEntityBase

var NewIndustryEntityFunc func(client *StatoriginSDK, entopts map[string]any) StatoriginEntityBase

var NewRegionEntityFunc func(client *StatoriginSDK, entopts map[string]any) StatoriginEntityBase

var NewSearchEntityFunc func(client *StatoriginSDK, entopts map[string]any) StatoriginEntityBase

var NewSourceEntityFunc func(client *StatoriginSDK, entopts map[string]any) StatoriginEntityBase

var NewStatisticEntityFunc func(client *StatoriginSDK, entopts map[string]any) StatoriginEntityBase

