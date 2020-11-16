const { iEcoService } = require('../rpc-services')

const client = require('@mctech/infra-cloud').getRpcClient()

const rap2 = client.bind({ url: 'http://rap2.taobao.org:38080/app/mock/258274' })

const mockData = async (url) => await rap2.get({ path: url })

// TODO: 改名tab2=> 页签名称
const endpoint =
  '/ec/services/projects/:orgId/generateTemplate/:projectCostId/tab2'

const iesPath = (orgId, activeItemId, id) =>
  `/projects/${orgId}/generateTemplate/${activeItemId}/tab2/${id ? '' : '/' + id}`

module.exports = [
  {
    description: '获取tab2列表接口',
    url: endpoint,
    method: 'get',
    req: {
      orgId: {
        type: 'integer',
        from: 'path',
        required: true
      }
    },
    res: {
      async mock () {
        const result = await mockData('/project/orgId/tab2')
        return result.data
      }
      // ,
      // handler (params, ctx, next) {
      //   const {
      //     orgId
      //   } = params
      //   return iEcoService.get({
      //     path: iesPath(orgId),
      //     body: ctx.request.body
      //   })
      // }
    }
  },
  {
    description: '更新XX列表中项',
    url: `${endpoint}/:id`,
    method: 'delete',
    req: {
      orgId: {
        type: 'integer',
        from: 'path',
        required: true
      }
    },
    res: {
      async mock () {
        const result = await mockData('/project/delete')
        return result.data
      }
      // ,
      // handler (params, ctx, next) {
      //   const {
      //     orgId
      //   } = params
      //   return iEcoService.patch({
      //     path: iesPath(orgId),
      //     body: ctx.request.body
      //   })
      // }
    }
  },
  {
    description: '删除XX列表中项',
    url: `${endpoint}/:id`,
    method: 'delete',
    req: {
      orgId: {
        type: 'integer',
        from: 'path',
        required: true
      }
    },
    res: {
      async mock () {
        const result = await mockData('/project/delete')
        return result.data
      }
      // ,
      // handler (params, ctx, next) {
      //   const {
      //     orgId
      //   } = params
      //   return iEcoService.delete({
      //     path: iesPath(orgId),
      //     body: ctx.request.body
      //   })
      // }
    }
  }
]
