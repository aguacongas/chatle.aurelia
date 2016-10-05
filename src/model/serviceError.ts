class Key {
    IDBCursorWithValue: string;
}

class ErrorMessage {
    errorMessage: string;
}

export class ServiceError {
    subKey: Key;
    errors: Array<ErrorMessage>;
}

