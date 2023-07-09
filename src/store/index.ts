import { createStore } from 'vuex'

export default createStore({
    state: {
        token: "",
        loginInfo: ""
    },
    getters: {
        token(state): string {
            return state.token || sessionStorage.getItem("token") || ""
        },
        loginInfo(state): string {
            return state.loginInfo || sessionStorage.getItem("loginInfo") || "{'loginName':'','password':''}"
        }
    },
    mutations: {
        SET_TOKEN(state, data) {
            state.token = data
            sessionStorage.setItem("token", data)
        },
        SET_LOGININFO(state, data) {
            state.loginInfo = data
            sessionStorage.setItem("loginInfo", data)
        },
        REMOTE_ALL(state) {
            state.token = ""
            state.loginInfo = ""
            sessionStorage.removeItem("token")
            sessionStorage.removeItem("loginInfo")
        }
    },
    actions: {
        setToken({ commit }: any, token: string) {
            commit("SET_TOKEN", token)
        },
        setLoginInfo({ commit }: any, loginInfo: string) {
            commit("SET_LOGININFO", loginInfo)
        },
        remoteAll({ commit }: any, token: string) {
            commit("REMOTE_ALL", token)
        },
    },
})
