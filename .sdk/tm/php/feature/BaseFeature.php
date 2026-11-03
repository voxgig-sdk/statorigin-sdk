<?php
declare(strict_types=1);

// Statorigin SDK base feature

class StatoriginBaseFeature
{
    public string $version;
    public string $name;
    public bool $active;

    // Positions this feature when added via the client `extend` option:
    // "__before__" / "__after__" / "__replace__" name an already-added
    // feature (mirrors the ts feature `_options`). Declared so setting it
    // on an extension instance avoids the dynamic-property deprecation.
    public ?array $_options = null;

    public function __construct()
    {
        $this->version = '0.0.1';
        $this->name = 'base';
        $this->active = true;
    }

    public function get_version(): string { return $this->version; }
    public function get_name(): string { return $this->name; }
    public function get_active(): bool { return $this->active; }

    public function init(StatoriginContext $ctx, array $options): void {}
    public function PostConstruct(StatoriginContext $ctx): void {}
    public function PostConstructEntity(StatoriginContext $ctx): void {}
    public function SetData(StatoriginContext $ctx): void {}
    public function GetData(StatoriginContext $ctx): void {}
    public function GetMatch(StatoriginContext $ctx): void {}
    public function SetMatch(StatoriginContext $ctx): void {}
    public function PrePoint(StatoriginContext $ctx): void {}
    public function PreSpec(StatoriginContext $ctx): void {}
    public function PreRequest(StatoriginContext $ctx): void {}
    public function PreResponse(StatoriginContext $ctx): void {}
    public function PreResult(StatoriginContext $ctx): void {}
    public function PreDone(StatoriginContext $ctx): void {}
    public function PreUnexpected(StatoriginContext $ctx): void {}
}
