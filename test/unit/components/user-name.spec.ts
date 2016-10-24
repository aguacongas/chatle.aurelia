import { Aurelia } from 'aurelia-framework';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';

describe('user-name component specs', () => {
  let component;

  beforeEach(() => {
    component = StageComponent
      .withResources('components/user-name')
      .inView('<user-name userName.bind="firstName"></user-namet>')
      .boundTo({ firstName: 'Test' });

    component.configure = (aurelia: Aurelia) => {
      aurelia.use
        .standardConfiguration()
        .plugin('aurelia-validation');
    }
  });

  it('should render user name', done => {
    component.create(bootstrap).then(() => {
      const nameElement = document.querySelector('.form-control');
      expect(nameElement['value']).toBe('Test');
      done();
    });
  });

  afterEach(() => {
    component.dispose();
  });
});