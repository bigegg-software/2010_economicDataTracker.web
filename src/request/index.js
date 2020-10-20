import Parse from 'parse'
Parse.initialize(process.env.VUE_APP_ID,process.env.JAVASCRIPT_KEY);
Parse.serverURL = process.env.VUE_APP_URL
export default Parse
