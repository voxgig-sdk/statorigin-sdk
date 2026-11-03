"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const Fs = __importStar(require("node:fs"));
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const live_runner_1 = require("../../live-runner");
const live_entity_1 = require("../../live-entity");
const __1 = require("../../..");
const utility_1 = require("../../utility");
(0, utility_1.loadEnvLocal)(__dirname + '/../../../.env.local');
(0, node_test_1.describe)('IndicatorEntity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when STATORIGIN_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('STATORIGIN_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.StatoriginSDK.test();
        const ent = testsdk.Indicator();
        (0, node_assert_1.default)(null != ent);
    });
    class FailHook extends __1.BaseFeature {
        name = 'failhook';
        version = '0.0.1';
        active = true;
        unexpected = 0;
        init() { }
        PreSpec() { throw new Error('indicator hook failed'); }
        PreUnexpected() { this.unexpected++; }
    }
    (0, node_test_1.test)('stream-error', async () => {
        const offline = { net: { offline: true } };
        await node_assert_1.default.rejects(async () => {
            for await (const _item of __1.StatoriginSDK.test(offline).Indicator().stream('list')) { }
        }, /offline/);
        for await (const _item of __1.StatoriginSDK.test(offline).Indicator()
            .stream('list', undefined, { ctrl: { throw: false } })) { }
        if (null != __1.config.feature?.rbac) {
            const denied = __1.StatoriginSDK.test(undefined, { feature: { rbac: { active: true, deny: true } } });
            await node_assert_1.default.rejects(async () => {
                for await (const _item of denied.Indicator().stream('list')) { }
            }, (err) => 'rbac_denied' === err.code);
        }
    });
    (0, node_test_1.test)('stream-ctrl', async () => {
        const explain = {};
        const ctrl = { explain };
        for await (const _item of __1.StatoriginSDK.test().Indicator().stream('list', undefined, { ctrl })) { }
        node_assert_1.default.deepStrictEqual(Object.keys(ctrl), ['explain']);
        (0, node_assert_1.default)(explain === ctrl.explain && 0 < Object.keys(explain).length);
    });
    (0, node_test_1.test)('unexpected', async () => {
        const hook = new FailHook();
        const client = new __1.StatoriginSDK({ feature: { test: { active: true } }, extend: [hook] });
        await node_assert_1.default.rejects(client.Indicator().list(), /hook failed/);
        (0, node_assert_1.default)(0 < hook.unexpected);
        const fired = hook.unexpected;
        node_assert_1.default.strictEqual(await client.Indicator().list(undefined, { throw: false }), undefined);
        (0, node_assert_1.default)(fired < hook.unexpected);
    });
    (0, node_test_1.test)('validate', async (t) => {
        if (null == __1.config.feature?.validate) {
            t.skip('feature not present in this SDK: validate');
            return;
        }
        const client = __1.StatoriginSDK.test(undefined, { feature: { validate: { active: true } } });
        await node_assert_1.default.rejects(client.Indicator().list({ "industry": 1 }), (err) => 'validate_failed' === err.code);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.STATORIGIN_TEST_LIVE;
        for (const op of ['list', 'load']) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'indicator.' + op, live))
                return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": { "definition": { "a": true, "h": "Definition", "n": "definition", "r": false, "t": "`$STRING`", "key$": "definition", "index$": 0 }, "id": { "a": true, "h": "Id", "n": "id", "r": false, "sh": "Stable prefixed identifier.", "t": "`$STRING`", "key$": "id", "index$": 1 }, "name": { "a": true, "h": "Name", "n": "name", "r": false, "t": "`$STRING`", "key$": "name", "index$": 2 }, "slug": { "a": true, "h": "Slug", "n": "slug", "r": false, "sh": "URL key: the item routes take this.", "t": "`$STRING`", "key$": "slug", "index$": 3 }, "unit": { "a": true, "h": "Unit", "n": "unit", "r": false, "t": "`$STRING`", "key$": "unit", "index$": 4 } }, "id": { "field": "slug", "name": "id" }, "name": "indicator", "op": { "list": { "input": "data", "name": "list", "points": [{ "a": true, "co": { "id": "GET /indicators", "source": "openapi3", "version": 2 }, "g": { "query": [{ "a": true, "k": "query", "n": "industry", "or": "industry", "r": false, "t": "`$STRING`", "index$": 0 }, { "a": true, "k": "query", "n": "q", "or": "q", "r": false, "t": "`$STRING`", "index$": 1 }] }, "k": "http", "m": "GET", "o": "/indicators", "q": {}, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "indicators" }], "t": { "req": "`reqdata`", "res": "`body.data`" }, "index$": 0 }], "key$": "list" }, "load": { "input": "data", "name": "load", "points": [{ "a": true, "co": { "id": "GET /indicators/{slug}", "source": "openapi3", "version": 2 }, "g": { "params": [{ "a": true, "ex": "global-ev-annual-sales", "k": "param", "n": "id", "or": "slug", "r": true, "t": "`$STRING`", "index$": 0 }] }, "k": "http", "m": "GET", "o": "/indicators/{slug}", "q": { "exist": ["id"] }, "r": { "param": { "slug": "id" } }, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "indicators" }, { "var": "id" }], "t": { "req": "`reqdata`", "res": "`body.data`" }, "index$": 0 }, { "a": true, "co": { "id": "GET /indicators/{slug}/series", "source": "openapi3", "version": 2 }, "g": { "params": [{ "a": true, "ex": "global-ev-annual-sales", "k": "param", "n": "slug", "or": "slug", "r": true, "t": "`$STRING`", "index$": 0 }], "query": [{ "a": true, "ex": 2015, "k": "query", "n": "from", "or": "from", "r": false, "t": "`$INTEGER`", "index$": 0 }, { "a": true, "k": "query", "n": "region", "or": "region", "r": false, "t": "`$STRING`", "index$": 1 }, { "a": true, "ex": 2026, "k": "query", "n": "to", "or": "to", "r": false, "t": "`$INTEGER`", "index$": 2 }] }, "k": "http", "m": "GET", "o": "/indicators/{slug}/series", "q": { "$action": "series", "exist": ["slug"] }, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "indicators" }, { "var": "slug" }, { "lit": "series" }], "t": { "req": "`reqdata`", "res": "`body.data`" }, "index$": 1 }], "key$": "load" } }, "relations": { "ancestors": [] }, "key$": "indicator", "name__orig": "indicator", "Name": "Indicator", "name_": "indicator", "name-": "indicator", "NAME": "INDICATOR", "index$": 0 }, { "active": true, "entity": "indicator", "key$": "BasicIndicatorFlow", "kind": "basic", "name": "BasicIndicatorFlow", "param": {}, "step": [{ "a": true, "d": {}, "i": {}, "m": {}, "o": "list", "s": [], "v": [{ "apply": "ItemExists", "def": { "ref": "indicator_ref01" } }], "index$": 0 }, { "a": true, "d": {}, "i": { "ref": "indicator_ref01", "srcdatavar": "indicator_ref01_data", "suffix": "_dt0" }, "m": { "id": "indicator01" }, "o": "load", "s": [], "v": [{ "apply": "TextFieldMark", "def": { "mark": "Mark01-indicator_ref01" } }], "index$": 1, "route": "GET /indicators/{slug}", "record": {} }] }, 'Indicator', { "GET /indicators": { "protocol": "http", "parameters": [{ "name": "industry", "in": "query", "schema": { "type": "string" }, "index$": 0 }, { "name": "q", "in": "query", "schema": { "type": "string" }, "description": "Substring match on name and definition", "index$": 1 }] }, "GET /indicators/{slug}": { "protocol": "http", "parameters": [{ "name": "slug", "in": "path", "required": true, "schema": { "type": "string" }, "example": "global-ev-annual-sales", "index$": 0 }] }, "GET /indicators/{slug}/series": { "protocol": "http", "parameters": [{ "name": "slug", "in": "path", "required": true, "schema": { "type": "string" }, "example": "global-ev-annual-sales", "index$": 0 }, { "name": "region", "in": "query", "schema": { "type": "string" }, "description": "Region code or slug. Defaults to GLOBAL.", "index$": 1 }, { "name": "from", "in": "query", "schema": { "type": "integer" }, "example": 2015, "index$": 2 }, { "name": "to", "in": "query", "schema": { "type": "integer" }, "example": 2026, "index$": 3 }] } }, { strict: LIVE_STRICT, t });
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        let indicator_ref01_data = Object.values(setup.data.existing.indicator)[0];
        // LIST
        const indicator_ref01_ent = client.Indicator();
        const indicator_ref01_match = {};
        const indicator_ref01_list = (await indicator_ref01_ent.list(indicator_ref01_match)).map((e) => e.data());
        // LOAD
        const indicator_ref01_match_dt0 = {};
        indicator_ref01_match_dt0.id = indicator_ref01_data.slug;
        const indicator_ref01_data_dt0 = (await indicator_ref01_ent.load(indicator_ref01_match_dt0)).data();
        (0, node_assert_1.default)(indicator_ref01_data_dt0.slug === indicator_ref01_data.slug);
    });
});
// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true;
function basicSetup(extra) {
    // TODO: fix test def options
    const options = {}; // null
    // TODO: needs test utility to resolve path
    const entityDataFile = node_path_1.default.resolve(__dirname, '../../../../.sdk/test/entity/indicator/IndicatorTestData.json');
    // TODO: file ready util needed?
    const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8');
    // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
    const entityData = JSON.parse(entityDataSource);
    for (const rec of Object.values(entityData.existing?.["indicator"] ?? {})) {
        if (null != rec?.id)
            rec.slug = rec.id;
    }
    options.entity = entityData.existing;
    let client = __1.StatoriginSDK.test(options, extra);
    const struct = client.utility().struct;
    const merge = struct.merge;
    const transform = struct.transform;
    let idmap = transform(['indicator01', 'indicator02', 'indicator03'], {
        '`$PACK`': ['', {
                '`$KEY`': '`$COPY`',
                '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
            }]
    });
    const env = (0, utility_1.envOverride)({
        'STATORIGIN_TEST_INDICATOR_ENTID': idmap,
        'STATORIGIN_TEST_LIVE': 'FALSE',
        'STATORIGIN_TEST_EXPLAIN': 'FALSE',
    });
    idmap = env['STATORIGIN_TEST_INDICATOR_ENTID'];
    const live = 'TRUE' === env.STATORIGIN_TEST_LIVE;
    const transport = (0, live_runner_1.createLiveTransport)();
    if (live) {
        const rawIds = process.env['STATORIGIN_TEST_INDICATOR_ENTID'];
        idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {};
        if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
            throw new Error('Live ENTID must be a JSON object');
        }
        client = new __1.StatoriginSDK(merge([
            // FIRST, so the generated fields below win: sdk-test-control.json's
            // test.client.options adds to the live client, it does not redirect it.
            (0, utility_1.liveClientOptions)(),
            {},
            // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
            // last entry is undefined, and basicSetup is normally called with no
            // argument at all - so a bare 'extra' silently discarded the apikey
            // and server values above and handed the SDK undefined. Harmless
            // while there was nothing in that object; not harmless now.
            extra || {},
            { system: { fetch: transport.fetch } }
        ]));
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
    };
    return setup;
}
//# sourceMappingURL=IndicatorEntity.test.js.map