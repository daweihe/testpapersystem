import Vue from 'vue'
import Router from 'vue-router'
import welcome from '../components/welcome.vue'
import ShowInfo from '../components/ShowInfo.vue'
import subjectImport from '../components/subjectImport.vue'
import generattest from '../components/generattest.vue'
import exporttest from '../components/exporttest.vue'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        component: welcome,
    }, {
        path: '/1',
        component: welcome
    }, {
        path: '/2',
        component: subjectImport
    }, {
        path: '/3',
        component: ShowInfo
    }, {
        path: '/4',
        component: generattest
    }, {
        path: '/5',
        component: exporttest
    }]
})