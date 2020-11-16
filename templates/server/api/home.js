const { iEcoService } = require('../rpc-services')

const client = require('@mctech/infra-cloud').getRpcClient()

const rap2 = client.bind({ url: 'http://rap2.taobao.org:38080/app/mock/258274' })

const mockData = async (url) => await rap2.get({ path: url })

// TODO: 改名
const endpoint =
  '/ec/services/projects/:orgId/generateTemplate'

const iesPath = (orgId, id) =>
  `/projects/${orgId}/generateTemplate/${id ? '' : '/' + id}`

module.exports = [
  {
    description: '获取主表列表接口',
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
        const result = await mockData('/projects/orgId/items')
        return result.data
      }
      // ,
      // handler (params, ctx, next) {
      //   const {
      //     orgId
      //   } = params
      //   return iEcoService.post({
      //     path: iesPath(orgId),
      //     body: ctx.request.body
      //   })
      // }
    }
  },
  {
    description: '新增主表项',
    url: endpoint,
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
        const result = await mockData('/project/orgId/add')
        return result.data
      }
      // ,
      // handler (params, ctx, next) {
      //   const {
      //     orgId
      //   } = params
      //   return iEcoService.post({
      //     path: iesPath(orgId),
      //     body: ctx.request.body
      //   })
      // }
    }
  },
  {
    description: '删除主表项接口',
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
      //   return iEcoService.post({
      //     path: `/projects/${orgId}/generateTemplate`,
      //     body: ctx.request.body
      //   })
      // }
    }
  },
  {
    description: '获取主表制定项详细信息',
    url: `${endpoint}/:id`,
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
        const result = await mockData('/project/orgId/projectItem/id')
        return result.data
      }
      // ,
      // handler (params, ctx, next) {
      //   const {
      //     orgId
      //   } = params
      //   return iEcoService.post({
      //     path: `/projects/${orgId}/generateTemplate`,
      //     body: ctx.request.body
      //   })
      // }
    }
  }
]
