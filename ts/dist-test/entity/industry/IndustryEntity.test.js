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
(0, node_test_1.describe)('IndustryEntity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when STATORIGIN_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('STATORIGIN_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.StatoriginSDK.test();
        const ent = testsdk.Industry();
        (0, node_assert_1.default)(null != ent);
    });
    class FailHook extends __1.BaseFeature {
        name = 'failhook';
        version = '0.0.1';
        active = true;
        unexpected = 0;
        init() { }
        PreSpec() { throw new Error('industry hook failed'); }
        PreUnexpected() { this.unexpected++; }
    }
    (0, node_test_1.test)('stream-error', async () => {
        const offline = { net: { offline: true } };
        await node_assert_1.default.rejects(async () => {
            for await (const _item of __1.StatoriginSDK.test(offline).Industry().stream('list')) { }
        }, /offline/);
        for await (const _item of __1.StatoriginSDK.test(offline).Industry()
            .stream('list', undefined, { ctrl: { throw: false } })) { }
        if (null != __1.config.feature?.rbac) {
            const denied = __1.StatoriginSDK.test(undefined, { feature: { rbac: { active: true, deny: true } } });
            await node_assert_1.default.rejects(async () => {
                for await (const _item of denied.Industry().stream('list')) { }
            }, (err) => 'rbac_denied' === err.code);
        }
    });
    (0, node_test_1.test)('stream-ctrl', async () => {
        const explain = {};
        const ctrl = { explain };
        for await (const _item of __1.StatoriginSDK.test().Industry().stream('list', undefined, { ctrl })) { }
        node_assert_1.default.deepStrictEqual(Object.keys(ctrl), ['explain']);
        (0, node_assert_1.default)(explain === ctrl.explain && 0 < Object.keys(explain).length);
    });
    (0, node_test_1.test)('unexpected', async () => {
        const hook = new FailHook();
        const client = new __1.StatoriginSDK({ feature: { test: { active: true } }, extend: [hook] });
        await node_assert_1.default.rejects(client.Industry().list(), /hook failed/);
        (0, node_assert_1.default)(0 < hook.unexpected);
        const fired = hook.unexpected;
        node_assert_1.default.strictEqual(await client.Industry().list(undefined, { throw: false }), undefined);
        (0, node_assert_1.default)(fired < hook.unexpected);
    });
    (0, node_test_1.test)('validate', async (t) => {
        if (null == __1.config.feature?.validate) {
            t.skip('feature not present in this SDK: validate');
            return;
        }
        const client = __1.StatoriginSDK.test(undefined, { feature: { validate: { active: true } } });
        await node_assert_1.default.rejects(client.Industry().list({ "level": "x" }), (err) => 'validate_failed' === err.code);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.STATORIGIN_TEST_LIVE;
        for (const op of ['list', 'load']) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'industry.' + op, live))
                return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": { "id": { "a": true, "h": "Id", "n": "id", "r": false, "sh": "Stable prefixed identifier.", "t": "`$STRING`", "key$": "id", "index$": 0 }, "isic": { "a": true, "h": "Isic", "n": "isic", "r": false, "t": "`$STRING`", "key$": "isic", "index$": 1 }, "level": { "a": true, "h": "Level", "n": "level", "r": false, "t": "`$INTEGER`", "key$": "level", "index$": 2 }, "name": { "a": true, "h": "Name", "n": "name", "r": false, "t": "`$STRING`", "key$": "name", "index$": 3 }, "parent_id": { "a": true, "h": "Parent Id", "n": "parent_id", "r": false, "t": "`$STRING`", "key$": "parent_id", "index$": 4 }, "slug": { "a": true, "h": "Slug", "n": "slug", "r": false, "sh": "URL key: the item routes take this.", "t": "`$STRING`", "key$": "slug", "index$": 5 } }, "id": { "field": "slug", "name": "id" }, "name": "industry", "op": { "list": { "input": "data", "name": "list", "points": [{ "a": true, "co": { "id": "GET /industries", "source": "openapi3", "version": 2 }, "g": { "query": [{ "a": true, "k": "query", "n": "level", "or": "level", "r": false, "t": "`$INTEGER`", "index$": 0 }, { "a": true, "ex": "C", "k": "query", "n": "parent", "or": "parent", "r": false, "t": "`$STRING`", "index$": 1 }] }, "k": "http", "m": "GET", "o": "/industries", "q": {}, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "industries" }], "t": { "req": "`reqdata`", "res": "`body.data`" }, "index$": 0 }], "key$": "list" }, "load": { "input": "data", "name": "load", "points": [{ "a": true, "co": { "id": "GET /industries/{slug}", "source": "openapi3", "version": 2 }, "g": { "params": [{ "a": true, "ex": "electric-vehicles", "k": "param", "n": "id", "or": "slug", "r": true, "t": "`$STRING`", "index$": 0 }] }, "k": "http", "m": "GET", "o": "/industries/{slug}", "q": { "exist": ["id"] }, "r": { "param": { "slug": "id" } }, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "industries" }, { "var": "id" }], "t": { "req": "`reqdata`", "res": "`body.data`" }, "index$": 0 }], "key$": "load" } }, "relations": { "ancestors": [] }, "key$": "industry", "name__orig": "industry", "Name": "Industry", "name_": "industry", "name-": "industry", "NAME": "INDUSTRY", "index$": 1 }, { "active": true, "entity": "industry", "key$": "BasicIndustryFlow", "kind": "basic", "name": "BasicIndustryFlow", "param": {}, "step": [{ "a": true, "d": {}, "i": {}, "m": {}, "o": "list", "s": [], "v": [{ "apply": "ItemExists", "def": { "ref": "industry_ref01" } }], "index$": 0 }, { "a": true, "d": {}, "i": { "ref": "industry_ref01", "srcdatavar": "industry_ref01_data", "suffix": "_dt0" }, "m": { "id": "industry01" }, "o": "load", "s": [], "v": [{ "apply": "TextFieldMark", "def": { "mark": "Mark01-industry_ref01" } }], "index$": 1, "route": "GET /industries/{slug}", "record": {} }] }, 'Industry', { "GET /industries": { "protocol": "http", "parameters": [{ "name": "level", "in": "query", "schema": { "type": "integer", "minimum": 1, "maximum": 4 }, "description": "1 = section, 2 = division", "index$": 0 }, { "name": "parent", "in": "query", "schema": { "type": "string" }, "description": "Parent ISIC code", "example": "C", "index$": 1 }] }, "GET /industries/{slug}": { "protocol": "http", "parameters": [{ "name": "slug", "in": "path", "required": true, "schema": { "type": "string" }, "example": "electric-vehicles", "index$": 0 }] } }, { strict: LIVE_STRICT, t });
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        let industry_ref01_data = Object.values(setup.data.existing.industry)[0];
        // LIST
        const industry_ref01_ent = client.Industry();
        const industry_ref01_match = {};
        const industry_ref01_list = (await industry_ref01_ent.list(industry_ref01_match)).map((e) => e.data());
        // LOAD
        const industry_ref01_match_dt0 = {};
        industry_ref01_match_dt0.id = industry_ref01_data.slug;
        const industry_ref01_data_dt0 = (await industry_ref01_ent.load(industry_ref01_match_dt0)).data();
        (0, node_assert_1.default)(industry_ref01_data_dt0.slug === industry_ref01_data.slug);
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
    const entityDataFile = node_path_1.default.resolve(__dirname, '../../../../.sdk/test/entity/industry/IndustryTestData.json');
    // TODO: file ready util needed?
    const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8');
    // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
    const entityData = JSON.parse(entityDataSource);
    for (const rec of Object.values(entityData.existing?.["industry"] ?? {})) {
        if (null != rec?.id)
            rec.slug = rec.id;
    }
    options.entity = entityData.existing;
    let client = __1.StatoriginSDK.test(options, extra);
    const struct = client.utility().struct;
    const merge = struct.merge;
    const transform = struct.transform;
    let idmap = transform(['industry01', 'industry02', 'industry03'], {
        '`$PACK`': ['', {
                '`$KEY`': '`$COPY`',
                '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
            }]
    });
    const env = (0, utility_1.envOverride)({
        'STATORIGIN_TEST_INDUSTRY_ENTID': idmap,
        'STATORIGIN_TEST_LIVE': 'FALSE',
        'STATORIGIN_TEST_EXPLAIN': 'FALSE',
    });
    idmap = env['STATORIGIN_TEST_INDUSTRY_ENTID'];
    const live = 'TRUE' === env.STATORIGIN_TEST_LIVE;
    const transport = (0, live_runner_1.createLiveTransport)();
    if (live) {
        const rawIds = process.env['STATORIGIN_TEST_INDUSTRY_ENTID'];
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
//# sourceMappingURL=IndustryEntity.test.js.map