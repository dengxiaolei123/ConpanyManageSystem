import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import MainBox from '../views/MainBox.vue'
import routeConfig from '../router/config.js'
import store from '../store/index.js'
const routes = [
  {
    path:"/login",
    name:"login",
    component:Login
  },
  {
    path:"/mainbox",
    name:"mainbox",
    component:MainBox
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to,from,next)=>{
  if(to.name==='login'){
    next()
  }else{
    // 判断是否登录
    if(!localStorage.getItem('token')){
      next({
        path:'/login'
      })
    }else{
      if(!store.state.isGetterRouter){
        //删除所有的嵌套路由

        router.removeRoute("mainbox")
        ConfigRouter()
        next({path:to.fullPath})
      }
      else{
        next()
      }
    }
  }
})

const ConfigRouter = ()=>{
  if(!router.hasRoute("mainbox")){
    router.addRoute(
      {
        path:"/mainbox",
        name:"mainbox",
        component:MainBox
      }
    )
  }
  routeConfig.forEach(item=>{
    checkPermission(item) && router.addRoute('mainbox',item)
})
  store.commit('changeGetterRouter',true)
}
const checkPermission=(item)=>{
  if(item.requireAdmin){
    return store.state.userInfo.role===1
  }
  return true
}
export default router
