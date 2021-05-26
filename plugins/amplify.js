import Vue from 'vue'
import Amplify from 'aws-amplify'
import '@aws-amplify/ui-vue'
import awsmobile from '../src/aws-exports'

Amplify.configure(awsmobile)
Vue.use(Amplify)
