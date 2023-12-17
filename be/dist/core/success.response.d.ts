export declare enum StatusCode {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
    PARTIAL_CONTENT = 206,
    MULTI_STATUS = 207,
    ALREADY_REPORTED = 208,
    IM_USED = 226
}
export declare enum ReasonPhrase {
    OK = "OK",
    CREATED = "Created",
    ACCEPTED = "Accepted",
    NO_CONTENT = "No Content",
    PARTIAL_CONTENT = "Partial Content",
    MULTI_STATUS = "Multi-Status",
    ALREADY_REPORTED = "Already Reported",
    IM_USED = "IM Used"
}
export declare class SuccessResponse {
    message: string;
    status: StatusCode;
    metadata: Record<string, any>;
    constructor({ message, statusCode, reasonPhrase, metadata, }: {
        message?: string;
        statusCode?: StatusCode;
        reasonPhrase?: ReasonPhrase;
        metadata?: Record<string, any>;
    });
}
export declare class OK extends SuccessResponse {
    constructor({ message, metadata }: {
        message?: string;
        metadata?: Record<string, any>;
    });
}
export declare class Created extends SuccessResponse {
    options: Record<string, any>;
    constructor({ options, message, statusCode, reasonPhrase, metadata, }: {
        options?: Record<string, any>;
        message?: string;
        statusCode?: StatusCode;
        reasonPhrase?: ReasonPhrase;
        metadata?: Record<string, any>;
    });
}
