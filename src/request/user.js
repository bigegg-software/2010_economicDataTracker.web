import Parse from './index'
import Axios from './axios'

function toJSON(data) {
  return JSON.parse(JSON.stringify(data))
}

export default {
  async logIn(params) {
    return Axios.post('/user/login', 
    {
      username:params.userName,
      password:params.password,
      code:Number(params.code)
    }
    ).then(function (response) {
          if(response.code==200){
            return response;
          }
      }).catch(function (error) {
          return error;
      });
    // let user= await Parse.Cloud.run('loginByUser',{userName:params.userName,password:params.password,code:Number(params.code)})
    // return toJSON(user.data.result)
  },
  async currentUser() {
    let user = await Parse.User.current()
    return user ? user.toJSON() : user
  },
  async becomeLogin(token) {
    let user = await Parse.User.become(token)
    return user.toJSON()
  },
  async validUserInfo(params) {
       return Axios.post('/user/validUserInfo',
       {
         username:params.userName,
         password:params.password
      }
       ).then(function (res) {
          return res;
      }).catch(function (error) {
          return error;
      });
    
  },
    async getSMSCode(params) {
    params.phone=Number(params.phone);
    return Axios.post('/user/getSMSCode', params).then(function (response) {
              return response;
          }).catch(function (error) {
              return error;
          });
  },
  async logOut() {
    return await Parse.User.logOut()
  }
}
