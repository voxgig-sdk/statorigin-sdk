# Statorigin SDK exists test

import pytest
from statorigin_sdk import StatoriginSDK


class TestExists:

    def test_should_create_test_sdk(self):
        testsdk = StatoriginSDK.test(None, None)
        assert testsdk is not None
