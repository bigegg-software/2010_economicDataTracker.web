import Parse from './index'

function toJSON(data) {
  return JSON.parse(JSON.stringify(data))
}

export default {
  async logIn(params) {
    let user = await Parse.User.logIn(params.userName, params.password, {
      usePost: true
    });
    return toJSON(user)
  },
  async currentUser() {
    let user = await Parse.User.current()
    return user ? user.toJSON() : user
  },
  async becomeLogin(token) {
    let user = await Parse.User.become(token)
    return user.toJSON()
  },
  async logOut() {
    return await Parse.User.logOut()
  }
}
