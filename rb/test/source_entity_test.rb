# Source entity test

require "minitest/autorun"
require "json"
require_relative "../Statorigin_sdk"
require_relative "runner"

class SourceEntityTest < Minitest::Test
  # main.kit.test.live.strict is true (the default is true): a live
  # request that fails, or a live test missing an input it needs,
  # fails the test.
  # An account with no record for a test to read skips it either way.
  LIVE_STRICT = true

  def test_create_instance
    testsdk = StatoriginSDK.test(nil, nil)
    ent = testsdk.Source(nil)
    assert !ent.nil?
  end

  def test_list_entities
    seed = {
      "entity" => {
        "source" => {
          "l1" => { "id" => "l1" },
          "l2" => { "id" => "l2" },
        },
      },
    }
    items = StatoriginSDK.test(seed, nil).Source(nil).list(nil, nil)
    # list resolves to one entity per record; data_get reads the record.
    assert_equal 2, items.length
    items.each do |item|
      assert item.respond_to?(:data_get)
      assert item.data_get.is_a?(Hash)
    end
  end

  # Feature #4: the entity stream(action, ...) method runs the op pipeline and
  # returns an Enumerator over result items. With the streaming feature active
  # it yields the feature's incremental output; otherwise it falls back to the
  # materialised list so stream always yields.
  def test_stream
    seed = {
      "entity" => {
        "source" => {
          "s1" => { "id" => "s1" },
          "s2" => { "id" => "s2" },
          "s3" => { "id" => "s3" },
        },
      },
    }

    # Fallback: streaming inactive -> yields the materialised list items.
    base = StatoriginSDK.test(seed, nil)
    seen = base.Source(nil).stream("list", nil, nil).to_a
    assert_equal 3, seen.length

    # Inbound: streaming active -> yields each item from the feature.
    cfg = StatoriginConfig.shared_config
    if cfg["feature"].is_a?(Hash) && cfg["feature"].key?("streaming")
      sdk = StatoriginSDK.test(seed, { "feature" => { "streaming" => { "active" => true } } })
      got = []
      sdk.Source(nil).stream("list", nil, nil).each do |item|
        if item.is_a?(Array)
          got.concat(item)
        else
          got << item
        end
      end
      assert_equal 3, got.length
    end
  end

  class FailHook < StatoriginBaseFeature
    attr_reader :unexpected

    def initialize
      super()
      @name = "failhook"
      @unexpected = 0
    end

    def PreSpec(ctx)
      raise "source hook failed"
    end

    def PreUnexpected(ctx)
      @unexpected += 1
    end
  end

  def test_stream_error
    offline = { "net" => { "offline" => true } }
    err = assert_raises(StandardError) do
      StatoriginSDK.test(offline, nil).Source(nil).stream("list", nil, nil).to_a
    end
    assert_match(/offline/, err.message)

    StatoriginSDK.test(offline, nil).Source(nil)
      .stream("list", nil, { "ctrl" => { "throw" => false } }).to_a

    cfg = StatoriginConfig.shared_config
    if cfg["feature"].is_a?(Hash) && cfg["feature"].key?("rbac")
      denied = StatoriginSDK.test(nil, { "feature" => { "rbac" => { "active" => true, "deny" => true } } })
      err = assert_raises(StandardError) do
        denied.Source(nil).stream("list", nil, nil).to_a
      end
      assert_equal "rbac_denied", err.code
    end
  end

  def test_stream_ctrl
    explain = {}
    ctrl = { "explain" => explain }
    StatoriginSDK.test(nil, nil).Source(nil).stream("list", nil, { "ctrl" => ctrl }).to_a
    assert_equal ["explain"], ctrl.keys
    assert_same explain, ctrl["explain"]
    refute_empty explain
  end

  def test_unexpected
    hook = FailHook.new
    client = StatoriginSDK.new({ "feature" => { "test" => { "active" => true } }, "extend" => [hook] })

    err = assert_raises(StandardError) do
      client.Source(nil).list(nil, nil)
    end
    assert_match(/hook failed/, err.message)
    assert_operator hook.unexpected, :>, 0

    fired = hook.unexpected
    assert_nil client.Source(nil).list(nil, { "throw" => false })
    assert_operator hook.unexpected, :>, fired
  end

  def test_validate_list_response
    cfg = StatoriginConfig.shared_config
    unless cfg["feature"].is_a?(Hash) && cfg["feature"].key?("validate")
      skip("feature not present in this SDK: validate")
    end
    opts = { "feature" => { "validate" => { "active" => true, "request" => false, "response" => true } } }
    listed = StatoriginSDK.test({ "entity" => { "source" => { "v1" => {  } } } }, opts).Source(nil).list(nil, nil)
    assert_equal ["v1"], listed.map { |ent| ent.data_get["id"] }
    err = assert_raises(StandardError) do
      StatoriginSDK.test({ "entity" => { "source" => { "v1" => { "name" => 1 } } } }, opts).Source(nil).list(nil, nil)
    end
    assert_equal "validate_failed", err.code
  end

  def test_validate
    cfg = StatoriginConfig.shared_config
    unless cfg["feature"].is_a?(Hash) && cfg["feature"].key?("validate")
      skip("feature not present in this SDK: validate")
    end
    client = StatoriginSDK.test(nil, { "feature" => { "validate" => { "active" => true } } })
    err = assert_raises(StandardError) do
      client.Source(nil).list({ "tier" => "x" }, nil)
    end
    assert_equal "validate_failed", err.code
  end

  def test_basic_flow
    setup = source_basic_setup(nil)
    # Per-op sdk-test-control.json skip.
    _live = setup[:live] || false
    ["list", "load"].each do |_op|
      _should_skip, _reason = Runner.is_control_skipped("entityOp", "source." + _op, _live ? "live" : "unit")
      if _should_skip
        skip(_reason || "skipped via sdk-test-control.json")
        return
      end
    end
    client = setup[:client]
    if setup[:live]
      Runner.live_existing(setup, LIVE_STRICT, "source") do
        client.Source(nil).list({}, nil)
      end
    end

    # Bootstrap entity data from existing test data.
    source_ref01_data_raw = Vs.items(Helpers.to_map(
      Vs.getpath(setup[:data], "existing.source")))
    source_ref01_data = nil
    if source_ref01_data_raw.length > 0
      source_ref01_data = Helpers.to_map(source_ref01_data_raw[0][1])
    end

    # LIST
    source_ref01_ent = client.Source(nil)
    source_ref01_match = {}

    source_ref01_list_result = source_ref01_ent.list(source_ref01_match, nil)
    assert source_ref01_list_result.is_a?(Array)

    # LOAD
    source_ref01_match_dt0 = {
      "id" => source_ref01_data["slug"],
    }
    source_ref01_data_dt0_loaded = source_ref01_ent.load(source_ref01_match_dt0, nil)
    source_ref01_data_dt0_load_result = Helpers.to_map(source_ref01_data_dt0_loaded.respond_to?(:data_get) ? source_ref01_data_dt0_loaded.data_get : source_ref01_data_dt0_loaded)
    assert !source_ref01_data_dt0_load_result.nil?
    assert_equal source_ref01_data_dt0_load_result["slug"], source_ref01_data["slug"]

  end
end

def source_basic_setup(extra)
  Runner.load_env_local

  entity_data_file = File.join(__dir__, "..", "..", ".sdk", "test", "entity", "source", "SourceTestData.json")
  entity_data_source = File.read(entity_data_file, encoding: "UTF-8")
  entity_data = JSON.parse(entity_data_source)

  ((entity_data["existing"] || {})["source"] || {}).each_value do |rec|
    rec["slug"] = rec["id"] if rec.is_a?(Hash) && !rec["id"].nil?
  end

  options = {}
  options["entity"] = entity_data["existing"]

  client = StatoriginSDK.test(options, extra)

  # Generate idmap via transform.
  idmap = Vs.transform(
    ["source01", "source02", "source03"],
    {
      "`$PACK`" => ["", {
        "`$KEY`" => "`$COPY`",
        "`$VAL`" => ["`$FORMAT`", "upper", "`$COPY`"],
      }],
    }
  )

  # Whether *_ENTID supplied the idmap, read before env_override consumes
  # it: without it, the ids a live flow binds are the fixture's synthetic ones.
  entid_env_raw = ENV["STATORIGIN_TEST_SOURCE_ENTID"]
  idmap_overridden = !entid_env_raw.nil? && entid_env_raw.strip.start_with?("{")

  env = Runner.env_override({
    "STATORIGIN_TEST_SOURCE_ENTID" => idmap,
    "STATORIGIN_TEST_LIVE" => "FALSE",
    "STATORIGIN_TEST_EXPLAIN" => "FALSE",
  })

  idmap_resolved = Helpers.to_map(
    env["STATORIGIN_TEST_SOURCE_ENTID"])
  if idmap_resolved.nil?
    idmap_resolved = Helpers.to_map(idmap)
  end

  if env["STATORIGIN_TEST_LIVE"] == "TRUE"
    merged_opts = Vs.merge([
      # FIRST, so the generated fields below win: sdk-test-control.json's
      # test.client.options adds to the live client, it does not redirect it.
      Runner.live_client_options,
      {
      },
      extra || {},
    ])
    client = StatoriginSDK.new(Helpers.to_map(merged_opts))
  end

  live = env["STATORIGIN_TEST_LIVE"] == "TRUE"
  {
    client: client,
    data: entity_data,
    idmap: idmap_resolved,
    env: env,
    explain: env["STATORIGIN_TEST_EXPLAIN"] == "TRUE",
    live: live,
    synthetic_only: live && !idmap_overridden,
    now: (Time.now.to_f * 1000).to_i,
  }
end
