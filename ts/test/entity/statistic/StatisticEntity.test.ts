

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


describe('StatisticEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when STATORIGIN_TEST_LIVE=TRUE.
  afterEach(liveDelay('STATORIGIN_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = StatoriginSDK.test()
    const ent = testsdk.Statistic()
    assert(null != ent)
  })


  class FailHook extends BaseFeature {
    name = 'failhook'
    version = '0.0.1'
    active = true
    unexpected = 0
    init() { }
    PreSpec() { throw new Error('statistic hook failed') }
    PreUnexpected() { this.unexpected++ }
  }

  test('stream-error', async () => {
    const offline = { net: { offline: true } }
    await assert.rejects(async () => {
      for await (const _item of StatoriginSDK.test(offline).Statistic().stream('list')) { }
    }, /offline/)

    for await (const _item of StatoriginSDK.test(offline).Statistic()
      .stream('list', undefined, { ctrl: { throw: false } })) { }

    if (null != (config as any).feature?.rbac) {
      const denied = StatoriginSDK.test(undefined, { feature: { rbac: { active: true, deny: true } } })
      await assert.rejects(async () => {
        for await (const _item of denied.Statistic().stream('list')) { }
      }, (err: any) => 'rbac_denied' === err.code)
    }
  })

  test('stream-ctrl', async () => {
    const explain: any = {}
    const ctrl: any = { explain }
    for await (const _item of StatoriginSDK.test().Statistic().stream('list', undefined, { ctrl })) { }
    assert.deepStrictEqual(Object.keys(ctrl), ['explain'])
    assert(explain === ctrl.explain && 0 < Object.keys(explain).length)
  })

  test('unexpected', async () => {
    const hook = new FailHook()
    const client = new StatoriginSDK({ feature: { test: { active: true } }, extend: [hook] })
    await assert.rejects(client.Statistic().list(), /hook failed/)
    assert(0 < hook.unexpected)

    const fired = hook.unexpected
    assert.strictEqual(await client.Statistic().list(undefined, { throw: false }), undefined)
    assert(fired < hook.unexpected)
  })

  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = StatoriginSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Statistic().list({"cursor":1} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.STATORIGIN_TEST_LIVE
    for (const op of ['list', 'load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'statistic.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"citation":{"a":true,"h":"Citation","n":"citation","r":true,"t":"`$OBJECT`","key$":"citation","index$":0},"confidence":{"a":true,"h":"Confidence","n":"confidence","r":false,"t":["`$ONE`",["`$NUMBER`","`$NULL`"]],"key$":"confidence","index$":1},"currency":{"a":true,"h":"Currency","n":"currency","r":false,"t":["`$ONE`",["`$STRING`","`$NULL`"]],"key$":"currency","index$":2},"id":{"a":true,"h":"Id","n":"id","r":true,"t":"`$STRING`","key$":"id","index$":3},"indicator":{"a":true,"h":"Indicator","n":"indicator","r":true,"t":"`$OBJECT`","key$":"indicator","index$":4},"industry":{"a":true,"h":"Industry","n":"industry","r":false,"t":"`$ARRAY`","key$":"industry","index$":5},"is_current":{"a":true,"h":"Is Current","n":"is_current","r":false,"sh":"False once superseded_by is set","t":"`$BOOLEAN`","key$":"is_current","index$":6},"is_secondhand":{"a":true,"h":"Is Secondhand","n":"is_secondhand","r":false,"sh":"True when the figure was relayed from a secondary source","t":"`$BOOLEAN`","key$":"is_secondhand","index$":7},"period":{"a":true,"h":"Period","n":"period","r":true,"t":"`$OBJECT`","key$":"period","index$":8},"region":{"a":true,"h":"Region","n":"region","r":true,"t":"`$OBJECT`","key$":"region","index$":9},"scale":{"a":true,"h":"Scale","n":"scale","r":false,"t":"`$STRING`","key$":"scale","index$":10},"source":{"a":true,"h":"Source","n":"source","r":true,"sh":"Complete provenance.","t":"`$OBJECT`","key$":"source","index$":11},"superseded_by":{"a":true,"h":"Superseded By","n":"superseded_by","r":false,"sh":"Id of the newer record that corrected this one.","t":["`$ONE`",["`$STRING`","`$NULL`"]],"key$":"superseded_by","index$":12},"supersedes":{"a":true,"h":"Supersedes","n":"supersedes","r":false,"sh":"Id of the older record this one corrected, if any","t":["`$ONE`",["`$STRING`","`$NULL`"]],"key$":"supersedes","index$":13},"unit":{"a":true,"h":"Unit","n":"unit","r":true,"t":"`$STRING`","key$":"unit","index$":14},"updated_at":{"a":true,"fo":"date-time","h":"Updated At","n":"updated_at","r":false,"t":"`$STRING`","key$":"updated_at","index$":15},"url":{"a":true,"fo":"uri","h":"Url","n":"url","r":true,"t":"`$STRING`","key$":"url","index$":16},"value":{"a":true,"h":"Value","n":"value","r":true,"t":"`$NUMBER`","key$":"value","index$":17},"value_text":{"a":true,"h":"Value Text","n":"value_text","r":false,"sh":"The source's own phrasing, preserved verbatim","t":["`$ONE`",["`$STRING`","`$NULL`"]],"key$":"value_text","index$":18},"value_type":{"a":true,"h":"Value Type","n":"value_type","r":false,"t":"`$STRING`","key$":"value_type","index$":19},"verification":{"a":true,"h":"Verification","n":"verification","r":false,"t":"`$STRING`","key$":"verification","index$":20},"verified_at":{"a":true,"fo":"date-time","h":"Verified At","n":"verified_at","r":false,"t":["`$ONE`",["`$STRING`","`$NULL`"]],"key$":"verified_at","index$":21},"verified_by":{"a":true,"h":"Verified By","n":"verified_by","r":false,"t":["`$ONE`",["`$STRING`","`$NULL`"]],"key$":"verified_by","index$":22}},"id":{"field":"id","name":"id"},"name":"statistic","op":{"list":{"input":"data","name":"list","points":[{"a":true,"co":{"id":"GET /statistics","source":"openapi3","version":2},"g":{"query":[{"a":true,"k":"query","n":"cursor","or":"cursor","r":false,"t":"`$STRING`","index$":0},{"a":true,"ex":"global-ev-annual-sales","k":"query","n":"indicator","or":"indicator","r":false,"t":"`$STRING`","index$":1},{"a":true,"ex":"electric-vehicles","k":"query","n":"industry","or":"industry","r":false,"t":"`$STRING`","index$":2},{"a":true,"ex":50,"k":"query","n":"limit","or":"limit","r":false,"t":"`$INTEGER`","index$":3},{"a":true,"ex":"CN,US","k":"query","n":"region","or":"region","r":false,"t":"`$STRING`","index$":4},{"a":true,"ex":"international-energy-agency","k":"query","n":"source_org","or":"source_org","r":false,"t":"`$STRING`","index$":5},{"a":true,"k":"query","n":"value_type","or":"value_type","r":false,"t":"`$STRING`","index$":6},{"a":true,"ex":"2020..2026","k":"query","n":"year","or":"year","r":false,"t":"`$STRING`","index$":7}]},"k":"http","m":"GET","o":"/statistics","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"statistics"}],"t":{"req":"`reqdata`","res":"`body.data`"},"index$":0}],"key$":"list"},"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /statistics/{id}","source":"openapi3","version":2},"g":{"params":[{"a":true,"ex":"stat_01M2HY9T5WMAQVXEKJ4XAX4XNG","k":"param","n":"id","or":"id","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/statistics/{id}","q":{"exist":["id"]},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"statistics"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body.data`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"statistic","name__orig":"statistic","Name":"Statistic","name_":"statistic","name-":"statistic","NAME":"STATISTIC","index$":5}, {"active":true,"entity":"statistic","key$":"BasicStatisticFlow","kind":"basic","name":"BasicStatisticFlow","param":{},"step":[{"a":true,"d":{},"i":{},"m":{},"o":"list","s":[],"v":[{"apply":"ItemExists","def":{"ref":"statistic_ref01"}}],"index$":0},{"a":true,"d":{},"i":{"ref":"statistic_ref01","srcdatavar":"statistic_ref01_data","suffix":"_dt0"},"m":{"id":"statistic01"},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-statistic_ref01"}}],"index$":1,"route":"GET /statistics/{id}","record":{}}]}, 'Statistic', {"GET /statistics":{"protocol":"http","parameters":[{"name":"industry","in":"query","schema":{"type":"string"},"description":"Industry slug. Comma-separate for multiple.","example":"electric-vehicles","index$":0},{"name":"region","in":"query","schema":{"type":"string"},"description":"Region code or slug. Comma-separate for multiple.","example":"CN,US","index$":1},{"name":"indicator","in":"query","schema":{"type":"string"},"description":"Indicator slug","example":"global-ev-annual-sales","index$":2},{"name":"year","in":"query","schema":{"type":"string"},"description":"Single year or inclusive range","example":"2020..2026","index$":3},{"name":"value_type","in":"query","schema":{"type":"string","enum":["actual","estimate","forecast"]},"index$":4},{"name":"source_org","in":"query","schema":{"type":"string"},"description":"Source organisation slug","example":"international-energy-agency","index$":5},{"name":"limit","in":"query","schema":{"type":"integer","minimum":1,"maximum":500,"default":50},"index$":6},{"name":"cursor","in":"query","schema":{"type":"string"},"description":"Opaque cursor from a previous `meta.next_cursor`","index$":7}]},"GET /statistics/{id}":{"protocol":"http","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"string"},"example":"stat_01M2HY9T5WMAQVXEKJ4XAX4XNG","index$":0}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let statistic_ref01_data = Object.values(setup.data.existing.statistic)[0] as any

    // LIST
    const statistic_ref01_ent = client.Statistic()
    const statistic_ref01_match: any = {}

    const statistic_ref01_list = (await statistic_ref01_ent.list(statistic_ref01_match)).map((e: any) => e.data())


    // LOAD
    const statistic_ref01_match_dt0: any = {}
    statistic_ref01_match_dt0.id = statistic_ref01_data.id
    const statistic_ref01_data_dt0 = (await statistic_ref01_ent.load(statistic_ref01_match_dt0)).data()
    assert(statistic_ref01_data_dt0.id === statistic_ref01_data.id)


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
      '../../../../.sdk/test/entity/statistic/StatisticTestData.json')

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
    ['statistic01','statistic02','statistic03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'STATORIGIN_TEST_STATISTIC_ENTID': idmap,
    'STATORIGIN_TEST_LIVE': 'FALSE',
    'STATORIGIN_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['STATORIGIN_TEST_STATISTIC_ENTID']

  const live = 'TRUE' === env.STATORIGIN_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['STATORIGIN_TEST_STATISTIC_ENTID']
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
  
