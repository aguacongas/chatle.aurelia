class Key {
    IDBCursorWithValue: string;
}

class ErrorMessage {
    errorMessage: string;
}

export class ServiceError {
    key: string;
    subKey: Key;
    errors: Array<ErrorMessage>;
}

