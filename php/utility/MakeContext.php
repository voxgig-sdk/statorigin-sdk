<?php
declare(strict_types=1);

// Statorigin SDK utility: make_context

require_once __DIR__ . '/../core/Context.php';

class StatoriginMakeContext
{
    public static function call(array $ctxmap, ?StatoriginContext $basectx): StatoriginContext
    {
        return new StatoriginContext($ctxmap, $basectx);
    }
}
