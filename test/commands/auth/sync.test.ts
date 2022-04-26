import {expect, test} from '@oclif/test'

describe('auth:sync', () => {
  test
  .stdout()
  .command(['auth:sync'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['auth:sync', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
