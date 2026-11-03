# Statorigin SDK utility: prepare_body
require_relative 'media'
module StatoriginUtilities
  PrepareBody = ->(ctx) {
    return nil unless ctx.op.input == "data"
    return StatoriginUtilities.raw_body(ctx.reqdata) if StatoriginUtilities.raw_request?(ctx.point)
    ctx.utility.transform_request.call(ctx)
  }
end
