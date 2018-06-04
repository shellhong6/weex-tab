/* global Vue */
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Tabs from '@/components/Tabs'

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/',
      redirect: 'tabs'
    },{
      path: '/helloworld',
      name: 'HelloWorld',
      component: HelloWorld
    }
    ,{
      path: '/tabs',
      name: 'Tabs',
      component: Tabs
    }
  ]
})

module.exports = router;
