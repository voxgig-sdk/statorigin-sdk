

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


describe('SearchEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when STATORIGIN_TEST_LIVE=TRUE.
  afterEach(liveDelay('STATORIGIN_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = StatoriginSDK.test()
    const ent = testsdk.Search()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = StatoriginSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Search().load({"limit":"x","q":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.STATORIGIN_TEST_LIVE
    for (const op of ['load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'search.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{},"name":"search","op":{"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /search","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":25,"k":"query","n":"limit","or":"limit","r":false,"t":"`$INTEGER`","index$":0},{"a":true,"ex":"electric","k":"query","n":"q","or":"q","r":true,"t":"`$STRING`","index$":1}]},"k":"http","m":"GET","o":"/search","q":{"exist":["q"]},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"search"}],"t":{"req":"`reqdata`","res":"`body.data`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"search","name__orig":"search","Name":"Search","name_":"search","name-":"search","NAME":"SEARCH","index$":3}, {"active":true,"entity":"search","key$":"BasicSearchFlow","kind":"basic","name":"BasicSearchFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"search_ref01","srcdatavar":"search_ref01_data","suffix":"_dt0"},"m":{},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-search_ref01"}}],"index$":0}]}, 'Search', {"GET /search":{"protocol":"http","parameters":[{"name":"q","in":"query","required":true,"schema":{"type":"string","minLength":2,"maxLength":120},"example":"electric","index$":0},{"name":"limit","in":"query","schema":{"type":"integer","minimum":1,"maximum":100,"default":25},"index$":1}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let search_ref01_data = Object.values(setup.data.existing.search)[0] as any

    // LOAD
    const search_ref01_ent = client.Search()
    const search_ref01_match_dt0: any = {}
    const search_ref01_data_dt0 = (await search_ref01_ent.load(search_ref01_match_dt0)).data()
    assert(null != search_ref01_data_dt0)


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
      '../../../../.sdk/test/entity/search/SearchTestData.json')

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
    ['search01','search02','search03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'STATORIGIN_TEST_SEARCH_ENTID': idmap,
    'STATORIGIN_TEST_LIVE': 'FALSE',
    'STATORIGIN_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['STATORIGIN_TEST_SEARCH_ENTID']

  const live = 'TRUE' === env.STATORIGIN_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['STATORIGIN_TEST_SEARCH_ENTID']
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
  
