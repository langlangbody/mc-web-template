export default function gen (store) {
  const orgId = store.$context.orgId
  const activeItemId = store.state.root.activeItem.id
  return `./services/projects/${orgId}/generateTemplate/${activeItemId}`
}
