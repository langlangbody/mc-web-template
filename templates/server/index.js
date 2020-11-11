const { iEcoService } = require('../rpc-services')

const client = require('@mctech/infra-cloud').getRpcClient()

const rap2 = client.bind({ url: 'http://rap2.taobao.org:38080/' })

const mockData = async (url) => await rap2.get({ path: url })

module.exports = [
  {
    description: '接口名称',
    url: '/ec/services/projects/:orgId/generateTemplate',
    method: 'post',
    req: {
      orgId: {
        type: 'integer',
        from: 'path',
        required: true
      }
    },
    res: {
      async mock () {
        const result = await mockData('app/mock/258274/projects/orgId/generateTemplate')
        return result.data
      },
      handler (params, ctx, next) {
        const {
          orgId
        } = params
        return iEcoService.post({
          path: `/projects/${orgId}/generateTemplate`,
          body: ctx.request.body
        })
      }
    }
  }
]
