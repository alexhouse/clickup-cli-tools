import {expect, test} from '@oclif/test'

describe('auth:team', () => {
  test
  .stdout()
  .command(['auth:team'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['auth:team', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
