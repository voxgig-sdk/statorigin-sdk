# Statorigin SDK utility: make_context
require_relative '../core/context'
module StatoriginUtilities
  MakeContext = ->(ctxmap, basectx) {
    StatoriginContext.new(ctxmap, basectx)
  }
end
