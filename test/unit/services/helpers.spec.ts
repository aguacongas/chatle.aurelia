import { Helpers } from '../../../src/services/helpers'
import { State } from '../../../src/services/state'
import { ServiceError } from '../../../src/model/serviceError';
import { Conversation } from '../../../src/model/conversation';

describe('helpers specs', () => {
    let state = new State();
    let service = new Helpers(state);

    it('getError should return an error with error message', () => {
        let serviceError = new ServiceError();
        serviceError.errors = [
            { errorMessage: 'test' }
        ];

        let result = service.getError({
            content: [
                serviceError
            ]
        });

        expect(result.message).toBe(serviceError.errors[0].errorMessage);
    });

    it('getUrlParameter should return the query string parameter value', () => {
        service.location = <Location>{
            search: '?test=value'
        };

        let result = service.getUrlParameter('test');

        expect(result).toBe('value');
    });
});
