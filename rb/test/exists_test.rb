# Statorigin SDK exists test

require "minitest/autorun"
require_relative "../Statorigin_sdk"

class ExistsTest < Minitest::Test
  def test_create_test_sdk
    testsdk = StatoriginSDK.test(nil, nil)
    assert !testsdk.nil?
  end
end
