-- Statorigin SDK exists test

local sdk = require("statorigin_sdk")

describe("StatoriginSDK", function()
  it("should create test SDK", function()
    local testsdk = sdk.test(nil, nil)
    assert.is_not_nil(testsdk)
  end)
end)
