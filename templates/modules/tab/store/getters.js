// 经常用到的state
const getters = {
  activeItem: state => state.root.activeItem,
  editPermission: state => state.root.permissions.indexOf('ec-project-edit') > -1
}

export default getters
