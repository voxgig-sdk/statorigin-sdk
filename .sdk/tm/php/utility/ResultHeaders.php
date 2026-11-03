<?php
declare(strict_types=1);

// Statorigin SDK utility: result_headers

class StatoriginResultHeaders
{
    public static function call(StatoriginContext $ctx): ?StatoriginResult
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result) {
            if ($response && is_array($response->headers)) {
                $result->headers = $response->headers;
            } else {
                $result->headers = [];
            }
        }
        return $result;
    }
}
