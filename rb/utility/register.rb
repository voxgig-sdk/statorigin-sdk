# Statorigin SDK utility registration
require_relative '../core/utility_type'
require_relative 'clean'
require_relative 'done'
require_relative 'make_error'
require_relative 'feature_add'
require_relative 'feature_hook'
require_relative 'feature_init'
require_relative 'fetcher'
require_relative 'make_fetch_def'
require_relative 'make_context'
require_relative 'make_options'
require_relative 'make_request'
require_relative 'make_response'
require_relative 'make_result'
require_relative 'make_point'
require_relative 'make_spec'
require_relative 'make_url'
require_relative 'param'
require_relative 'prepare_auth'
require_relative 'prepare_body'
require_relative 'prepare_headers'
require_relative 'prepare_method'
require_relative 'prepare_params'
require_relative 'prepare_path'
require_relative 'prepare_query'
require_relative 'graphql'
require_relative 'result_basic'
require_relative 'result_body'
require_relative 'result_headers'
require_relative 'transform_request'
require_relative 'transform_response'

StatoriginUtility.registrar = ->(u) {
  u.clean = StatoriginUtilities::Clean
  u.clean_add = StatoriginUtilities::CleanAdd
  u.clean_explain = StatoriginUtilities::CleanExplain
  u.done = StatoriginUtilities::Done
  u.make_error = StatoriginUtilities::MakeError
  u.feature_add = StatoriginUtilities::FeatureAdd
  u.feature_hook = StatoriginUtilities::FeatureHook
  u.feature_init = StatoriginUtilities::FeatureInit
  u.fetcher = StatoriginUtilities::Fetcher
  u.make_fetch_def = StatoriginUtilities::MakeFetchDef
  u.make_context = StatoriginUtilities::MakeContext
  u.make_options = StatoriginUtilities::MakeOptions
  u.make_request = StatoriginUtilities::MakeRequest
  u.make_response = StatoriginUtilities::MakeResponse
  u.make_result = StatoriginUtilities::MakeResult
  u.make_point = StatoriginUtilities::MakePoint
  u.make_spec = StatoriginUtilities::MakeSpec
  u.make_url = StatoriginUtilities::MakeUrl
  u.param = StatoriginUtilities::Param
  u.prepare_auth = StatoriginUtilities::PrepareAuth
  u.prepare_body = StatoriginUtilities::PrepareBody
  u.prepare_headers = StatoriginUtilities::PrepareHeaders
  u.prepare_method = StatoriginUtilities::PrepareMethod
  u.prepare_params = StatoriginUtilities::PrepareParams
  u.prepare_path = StatoriginUtilities::PreparePath
  u.prepare_query = StatoriginUtilities::PrepareQuery
  u.graphql_body = StatoriginUtilities::GraphqlBody
  u.graphql_errors = StatoriginUtilities::GraphqlErrors
  u.result_basic = StatoriginUtilities::ResultBasic
  u.result_body = StatoriginUtilities::ResultBody
  u.result_headers = StatoriginUtilities::ResultHeaders
  u.transform_request = StatoriginUtilities::TransformRequest
  u.transform_response = StatoriginUtilities::TransformResponse
}
