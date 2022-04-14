import { expect, test } from '@oclif/test'

describe('auth', () => {
  context('when --check is passed', () => {
    test
      .loadConfig()
      .do(ctx => {
        ctx.config.configDir = `${__dirname}/../fixtures/empty`
      })
      .command(['auth', '--check'])
      .exit(100)
      .it('returns unauthenticated with no user', (_, done) => {
        done();
      });

    test
      .nock('https://api.clickup.com/api/v2', api => {
        api.get('/user').reply(200, {
          user: {
            id: 12345,
            username: 'Potato',
            email: 'fake@email.com',
            color: '#ffffff',
          }
        });
      })
      .stdout()
      .loadConfig()
      .do(ctx => {
        ctx.config.configDir = `${__dirname}/../fixtures/populated`
      })
      .command(['auth', '--check'])
      .it('returns current username with a valid config', ctx => {
        ctx.config.configDir = 'test/fixtures/populated';
        expect(ctx.stdout).to.contain('Loading user configuration from');
        expect(ctx.stdout).to.contain('Authenticated as Potato');
      });
  });
})
