# Statorigin SDK utility: make_context

from statorigin_sdk.core.context import StatoriginContext


def make_context_util(ctxmap, basectx):
    return StatoriginContext(ctxmap, basectx)
