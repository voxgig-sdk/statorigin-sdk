# Statorigin SDK feature factory

require_relative 'feature/base_feature'
require_relative 'feature/ratelimit_feature'
require_relative 'feature/retry_feature'
require_relative 'feature/test_feature'
require_relative 'feature/timeout_feature'


module StatoriginFeatures
  def self.make_feature(name)
    case name
    when "base"
      StatoriginBaseFeature.new
    when "ratelimit"
      StatoriginRatelimitFeature.new
    when "retry"
      StatoriginRetryFeature.new
    when "test"
      StatoriginTestFeature.new
    when "timeout"
      StatoriginTimeoutFeature.new
    else
      StatoriginBaseFeature.new
    end
  end
end
