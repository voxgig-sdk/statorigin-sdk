

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


describe('IndustryEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when STATORIGIN_TEST_LIVE=TRUE.
  afterEach(liveDelay('STATORIGIN_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = StatoriginSDK.test()
    const ent = testsdk.Industry()
    assert(null != ent)
  })


  class FailHook extends BaseFeature {
    name = 'failhook'
    version = '0.0.1'
    active = true
    unexpected = 0
    init() { }
    PreSpec() { throw new Error('industry hook failed') }
    PreUnexpected() { this.unexpected++ }
  }

  test('stream-error', async () => {
    const offline = { net: { offline: true } }
    await assert.rejects(async () => {
      for await (const _item of StatoriginSDK.test(offline).Industry().stream('list')) { }
    }, /offline/)

    for await (const _item of StatoriginSDK.test(offline).Industry()
      .stream('list', undefined, { ctrl: { throw: false } })) { }

    if (null != (config as any).feature?.rbac) {
      const denied = StatoriginSDK.test(undefined, { feature: { rbac: { active: true, deny: true } } })
      await assert.rejects(async () => {
        for await (const _item of denied.Industry().stream('list')) { }
      }, (err: any) => 'rbac_denied' === err.code)
    }
  })

  test('stream-ctrl', async () => {
    const explain: any = {}
    const ctrl: any = { explain }
    for await (const _item of StatoriginSDK.test().Industry().stream('list', undefined, { ctrl })) { }
    assert.deepStrictEqual(Object.keys(ctrl), ['explain'])
    assert(explain === ctrl.explain && 0 < Object.keys(explain).length)
  })

  test('unexpected', async () => {
    const hook = new FailHook()
    const client = new StatoriginSDK({ feature: { test: { active: true } }, extend: [hook] })
    await assert.rejects(client.Industry().list(), /hook failed/)
    assert(0 < hook.unexpected)

    const fired = hook.unexpected
    assert.strictEqual(await client.Industry().list(undefined, { throw: false }), undefined)
    assert(fired < hook.unexpected)
  })

  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = StatoriginSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Industry().list({"level":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.STATORIGIN_TEST_LIVE
    for (const op of ['list', 'load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'industry.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"id":{"a":true,"h":"Id","n":"id","r":false,"sh":"Stable prefixed identifier.","t":"`$STRING`","key$":"id","index$":0},"isic":{"a":true,"h":"Isic","n":"isic","r":false,"t":"`$STRING`","key$":"isic","index$":1},"level":{"a":true,"h":"Level","n":"level","r":false,"t":"`$INTEGER`","key$":"level","index$":2},"name":{"a":true,"h":"Name","n":"name","r":false,"t":"`$STRING`","key$":"name","index$":3},"parent_id":{"a":true,"h":"Parent Id","n":"parent_id","r":false,"t":"`$STRING`","key$":"parent_id","index$":4},"slug":{"a":true,"h":"Slug","n":"slug","r":false,"sh":"URL key: the item routes take this.","t":"`$STRING`","key$":"slug","index$":5}},"id":{"field":"slug","name":"id"},"name":"industry","op":{"list":{"input":"data","name":"list","points":[{"a":true,"co":{"id":"GET /industries","source":"openapi3","version":2},"g":{"query":[{"a":true,"k":"query","n":"level","or":"level","r":false,"t":"`$INTEGER`","index$":0},{"a":true,"ex":"C","k":"query","n":"parent","or":"parent","r":false,"t":"`$STRING`","index$":1}]},"k":"http","m":"GET","o":"/industries","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"industries"}],"t":{"req":"`reqdata`","res":"`body.data`"},"index$":0}],"key$":"list"},"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /industries/{slug}","source":"openapi3","version":2},"g":{"params":[{"a":true,"ex":"electric-vehicles","k":"param","n":"id","or":"slug","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/industries/{slug}","q":{"exist":["id"]},"r":{"param":{"slug":"id"}},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"industries"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body.data`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"industry","name__orig":"industry","Name":"Industry","name_":"industry","name-":"industry","NAME":"INDUSTRY","index$":1}, {"active":true,"entity":"industry","key$":"BasicIndustryFlow","kind":"basic","name":"BasicIndustryFlow","param":{},"step":[{"a":true,"d":{},"i":{},"m":{},"o":"list","s":[],"v":[{"apply":"ItemExists","def":{"ref":"industry_ref01"}}],"index$":0},{"a":true,"d":{},"i":{"ref":"industry_ref01","srcdatavar":"industry_ref01_data","suffix":"_dt0"},"m":{"id":"industry01"},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-industry_ref01"}}],"index$":1,"route":"GET /industries/{slug}","record":{}}]}, 'Industry', {"GET /industries":{"protocol":"http","parameters":[{"name":"level","in":"query","schema":{"type":"integer","minimum":1,"maximum":4},"description":"1 = section, 2 = division","index$":0},{"name":"parent","in":"query","schema":{"type":"string"},"description":"Parent ISIC code","example":"C","index$":1}]},"GET /industries/{slug}":{"protocol":"http","parameters":[{"name":"slug","in":"path","required":true,"schema":{"type":"string"},"example":"electric-vehicles","index$":0}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let industry_ref01_data = Object.values(setup.data.existing.industry)[0] as any

    // LIST
    const industry_ref01_ent = client.Industry()
    const industry_ref01_match: any = {}

    const industry_ref01_list = (await industry_ref01_ent.list(industry_ref01_match)).map((e: any) => e.data())


    // LOAD
    const industry_ref01_match_dt0: any = {}
    industry_ref01_match_dt0.id = industry_ref01_data.slug
    const industry_ref01_data_dt0 = (await industry_ref01_ent.load(industry_ref01_match_dt0)).data()
    assert(industry_ref01_data_dt0.slug === industry_ref01_data.slug)


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
      '../../../../.sdk/test/entity/industry/IndustryTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  for (const rec of Object.values(entityData.existing?.["industry"] ?? {}) as any[]) {
    if (null != rec?.id) rec.slug = rec.id
  }

  options.entity = entityData.existing

  let client = StatoriginSDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['industry01','industry02','industry03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'STATORIGIN_TEST_INDUSTRY_ENTID': idmap,
    'STATORIGIN_TEST_LIVE': 'FALSE',
    'STATORIGIN_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['STATORIGIN_TEST_INDUSTRY_ENTID']

  const live = 'TRUE' === env.STATORIGIN_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['STATORIGIN_TEST_INDUSTRY_ENTID']
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
  
