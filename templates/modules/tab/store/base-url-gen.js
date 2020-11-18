export default function gen (store) {
  const orgId = store.$context.orgId
  return `./services/projects/${orgId}/project-template-demo`
}
