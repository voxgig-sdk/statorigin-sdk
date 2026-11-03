

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


describe('SourceEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when STATORIGIN_TEST_LIVE=TRUE.
  afterEach(liveDelay('STATORIGIN_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = StatoriginSDK.test()
    const ent = testsdk.Source()
    assert(null != ent)
  })


  class FailHook extends BaseFeature {
    name = 'failhook'
    version = '0.0.1'
    active = true
    unexpected = 0
    init() { }
    PreSpec() { throw new Error('source hook failed') }
    PreUnexpected() { this.unexpected++ }
  }

  test('stream-error', async () => {
    const offline = { net: { offline: true } }
    await assert.rejects(async () => {
      for await (const _item of StatoriginSDK.test(offline).Source().stream('list')) { }
    }, /offline/)

    for await (const _item of StatoriginSDK.test(offline).Source()
      .stream('list', undefined, { ctrl: { throw: false } })) { }

    if (null != (config as any).feature?.rbac) {
      const denied = StatoriginSDK.test(undefined, { feature: { rbac: { active: true, deny: true } } })
      await assert.rejects(async () => {
        for await (const _item of denied.Source().stream('list')) { }
      }, (err: any) => 'rbac_denied' === err.code)
    }
  })

  test('stream-ctrl', async () => {
    const explain: any = {}
    const ctrl: any = { explain }
    for await (const _item of StatoriginSDK.test().Source().stream('list', undefined, { ctrl })) { }
    assert.deepStrictEqual(Object.keys(ctrl), ['explain'])
    assert(explain === ctrl.explain && 0 < Object.keys(explain).length)
  })

  test('unexpected', async () => {
    const hook = new FailHook()
    const client = new StatoriginSDK({ feature: { test: { active: true } }, extend: [hook] })
    await assert.rejects(client.Source().list(), /hook failed/)
    assert(0 < hook.unexpected)

    const fired = hook.unexpected
    assert.strictEqual(await client.Source().list(undefined, { throw: false }), undefined)
    assert(fired < hook.unexpected)
  })

  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = StatoriginSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Source().list({"tier":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.STATORIGIN_TEST_LIVE
    for (const op of ['list', 'load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'source.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"id":{"a":true,"h":"Id","n":"id","r":false,"sh":"Stable prefixed identifier.","t":"`$STRING`","key$":"id","index$":0},"name":{"a":true,"h":"Name","n":"name","r":false,"t":"`$STRING`","key$":"name","index$":1},"short_name":{"a":true,"h":"Short Name","n":"short_name","r":false,"t":"`$STRING`","key$":"short_name","index$":2},"slug":{"a":true,"h":"Slug","n":"slug","r":false,"sh":"URL key: the item routes take this.","t":"`$STRING`","key$":"slug","index$":3},"tier":{"a":true,"h":"Tier","n":"tier","r":false,"t":"`$INTEGER`","key$":"tier","index$":4},"type":{"a":true,"h":"Type","n":"type","r":false,"t":"`$STRING`","key$":"type","index$":5}},"id":{"field":"slug","name":"id"},"name":"source","op":{"list":{"input":"data","name":"list","points":[{"a":true,"co":{"id":"GET /sources","source":"openapi3","version":2},"g":{"query":[{"a":true,"k":"query","n":"tier","or":"tier","r":false,"t":"`$INTEGER`","index$":0}]},"k":"http","m":"GET","o":"/sources","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"sources"}],"t":{"req":"`reqdata`","res":"`body.data`"},"index$":0}],"key$":"list"},"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /sources/{slug}","source":"openapi3","version":2},"g":{"params":[{"a":true,"ex":"international-energy-agency","k":"param","n":"id","or":"slug","r":true,"t":"`$STRING`","index$":0}],"query":[{"a":true,"ex":100,"k":"query","n":"limit","or":"limit","r":false,"t":"`$INTEGER`","index$":0}]},"k":"http","m":"GET","o":"/sources/{slug}","q":{"exist":["id"]},"r":{"param":{"slug":"id"}},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"sources"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body.data`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"source","name__orig":"source","Name":"Source","name_":"source","name-":"source","NAME":"SOURCE","index$":4}, {"active":true,"entity":"source","key$":"BasicSourceFlow","kind":"basic","name":"BasicSourceFlow","param":{},"step":[{"a":true,"d":{},"i":{},"m":{},"o":"list","s":[],"v":[{"apply":"ItemExists","def":{"ref":"source_ref01"}}],"index$":0},{"a":true,"d":{},"i":{"ref":"source_ref01","srcdatavar":"source_ref01_data","suffix":"_dt0"},"m":{"id":"source01"},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-source_ref01"}}],"index$":1,"route":"GET /sources/{slug}","record":{}}]}, 'Source', {"GET /sources":{"protocol":"http","parameters":[{"name":"tier","in":"query","schema":{"type":"integer","minimum":1,"maximum":4},"index$":0}]},"GET /sources/{slug}":{"protocol":"http","parameters":[{"name":"slug","in":"path","required":true,"schema":{"type":"string"},"example":"international-energy-agency","index$":0},{"name":"limit","in":"query","schema":{"type":"integer","minimum":1,"maximum":500,"default":100},"index$":1}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let source_ref01_data = Object.values(setup.data.existing.source)[0] as any

    // LIST
    const source_ref01_ent = client.Source()
    const source_ref01_match: any = {}

    const source_ref01_list = (await source_ref01_ent.list(source_ref01_match)).map((e: any) => e.data())


    // LOAD
    const source_ref01_match_dt0: any = {}
    source_ref01_match_dt0.id = source_ref01_data.slug
    const source_ref01_data_dt0 = (await source_ref01_ent.load(source_ref01_match_dt0)).data()
    assert(source_ref01_data_dt0.slug === source_ref01_data.slug)


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
      '../../../../.sdk/test/entity/source/SourceTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  for (const rec of Object.values(entityData.existing?.["source"] ?? {}) as any[]) {
    if (null != rec?.id) rec.slug = rec.id
  }

  options.entity = entityData.existing

  let client = StatoriginSDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['source01','source02','source03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'STATORIGIN_TEST_SOURCE_ENTID': idmap,
    'STATORIGIN_TEST_LIVE': 'FALSE',
    'STATORIGIN_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['STATORIGIN_TEST_SOURCE_ENTID']

  const live = 'TRUE' === env.STATORIGIN_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['STATORIGIN_TEST_SOURCE_ENTID']
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
  
