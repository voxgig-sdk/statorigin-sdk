# Statorigin SDK feature factory

from statorigin_sdk.feature.base_feature import StatoriginBaseFeature
from statorigin_sdk.feature.ratelimit_feature import StatoriginRatelimitFeature
from statorigin_sdk.feature.retry_feature import StatoriginRetryFeature
from statorigin_sdk.feature.test_feature import StatoriginTestFeature
from statorigin_sdk.feature.timeout_feature import StatoriginTimeoutFeature


_FEATURES = {
    "base": lambda: StatoriginBaseFeature(),
    "ratelimit": lambda: StatoriginRatelimitFeature(),
    "retry": lambda: StatoriginRetryFeature(),
    "test": lambda: StatoriginTestFeature(),
    "timeout": lambda: StatoriginTimeoutFeature(),
}


def _make_feature(name):
    factory = _FEATURES.get(name)
    if factory is not None:
        return factory()
    return _FEATURES["base"]()


# True when this SDK was generated with the named feature class - the
# constructor's tolerance for extend-carried features reads this (an
# active name with no generated class must not become a BaseFeature
# stray when an extend instance carries it).
def _has_feature(name):
    return name in _FEATURES
