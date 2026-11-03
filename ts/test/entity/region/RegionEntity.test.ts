

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { StatoriginSDK, BaseFeature, config, stdutil } from '../../..'

import {
  envOverride,
  liveClientOptions,
  liveDelay,
  loadEnvLocal,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


loadEnvLocal(__dirname + '/../../../.env.local')


describe('RegionEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when STATORIGIN_TEST_LIVE=TRUE.
  afterEach(liveDelay('STATORIGIN_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = StatoriginSDK.test()
    const ent = testsdk.Region()
    assert(null != ent)
  })


  class FailHook extends BaseFeature {
    name = 'failhook'
    version = '0.0.1'
    active = true
    unexpected = 0
    init() { }
    PreSpec() { throw new Error('region hook failed') }
    PreUnexpected() { this.unexpected++ }
  }

  test('stream-error', async () => {
    const offline = { net: { offline: true } }
    await assert.rejects(async () => {
      for await (const _item of StatoriginSDK.test(offline).Region().stream('list')) { }
    }, /offline/)

    for await (const _item of StatoriginSDK.test(offline).Region()
      .stream('list', undefined, { ctrl: { throw: false } })) { }

    if (null != (config as any).feature?.rbac) {
      const denied = StatoriginSDK.test(undefined, { feature: { rbac: { active: true, deny: true } } })
      await assert.rejects(async () => {
        for await (const _item of denied.Region().stream('list')) { }
      }, (err: any) => 'rbac_denied' === err.code)
    }
  })

  test('stream-ctrl', async () => {
    const explain: any = {}
    const ctrl: any = { explain }
    for await (const _item of StatoriginSDK.test().Region().stream('list', undefined, { ctrl })) { }
    assert.deepStrictEqual(Object.keys(ctrl), ['explain'])
    assert(explain === ctrl.explain && 0 < Object.keys(explain).length)
  })

  test('unexpected', async () => {
    const hook = new FailHook()
    const client = new StatoriginSDK({ feature: { test: { active: true } }, extend: [hook] })
    await assert.rejects(client.Region().list(), /hook failed/)
    assert(0 < hook.unexpected)

    const fired = hook.unexpected
    assert.strictEqual(await client.Region().list(undefined, { throw: false }), undefined)
    assert(fired < hook.unexpected)
  })

  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = StatoriginSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Region().list({"type":1} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.STATORIGIN_TEST_LIVE
    for (const op of ['list']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'region.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"data":{"a":true,"h":"Data","n":"data","r":false,"t":"`$ARRAY`","key$":"data","index$":0},"meta":{"a":true,"h":"Meta","n":"meta","r":false,"t":"`$OBJECT`","key$":"meta","index$":1}},"name":"region","op":{"list":{"input":"data","name":"list","points":[{"a":true,"co":{"id":"GET /regions","source":"openapi3","version":2},"g":{"query":[{"a":true,"k":"query","n":"type","or":"type","r":false,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/regions","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"regions"}],"t":{"req":"`reqdata`","res":"`body.data`"},"index$":0}],"key$":"list"}},"relations":{"ancestors":[]},"key$":"region","name__orig":"region","Name":"Region","name_":"region","name-":"region","NAME":"REGION","index$":2}, {"active":true,"entity":"region","key$":"BasicRegionFlow","kind":"basic","name":"BasicRegionFlow","param":{},"step":[{"a":true,"d":{},"i":{},"m":{},"o":"list","s":[],"v":[{"apply":"ItemExists","def":{"ref":"region_ref01"}}],"index$":0}]}, 'Region', {"GET /regions":{"protocol":"http","parameters":[{"name":"type","in":"query","schema":{"type":"string","enum":["world","country","bloc","subnational"]},"index$":0}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let region_ref01_data = Object.values(setup.data.existing.region)[0] as any

    // LIST
    const region_ref01_ent = client.Region()
    const region_ref01_match: any = {}

    const region_ref01_list = (await region_ref01_ent.list(region_ref01_match)).map((e: any) => e.data())


  })
})



// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true

function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/region/RegionTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = StatoriginSDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['region01','region02','region03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'STATORIGIN_TEST_REGION_ENTID': idmap,
    'STATORIGIN_TEST_LIVE': 'FALSE',
    'STATORIGIN_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['STATORIGIN_TEST_REGION_ENTID']

  const live = 'TRUE' === env.STATORIGIN_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['STATORIGIN_TEST_REGION_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new StatoriginSDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
      {
      },
      // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
      // last entry is undefined, and basicSetup is normally called with no
      // argument at all - so a bare 'extra' silently discarded the apikey
      // and server values above and handed the SDK undefined. Harmless
      // while there was nothing in that object; not harmless now.
      extra || {},
      { system: { fetch: transport.fetch } }
    ]))
  }

  const setup = {
    idmap,
    env,
    options,
    client,
    struct,
    data: entityData,
    explain: 'TRUE' === env.STATORIGIN_TEST_EXPLAIN,
    live,
    transport,
    now: Date.now(),
  }

  return setup
}
  
