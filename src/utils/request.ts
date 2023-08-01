import axios from "axios"
import store from "@/store/index"
import { start, close } from "@/utils/progress"
import { ElMessage } from "element-plus"
import qs from "qs"

//创建axios实例
const service = axios.create({
    timeout: 100000, //请求超时时间10s
})

//request拦截器
service.interceptors.request.use(
    (config) => {
        //api的切换
        if (/ext/i.test(config.url || "")) {
            //config.baseURL = "http://101.42.232.67:7777"
            config.baseURL = "http://localhost:7777"
            config.headers && !config.headers["Content-Type"] && (config.headers["Content-Type"] = "application/json")
        } else {
            config.baseURL = "http://183.230.44.139:8090"
            config.headers && (config.headers["Content-Type"] = "application/x-www-form-urlencoded")
            //让每一个请求都带上token
            if (store.getters["token"]) {
                if (config && config.headers) {
                    config.data = qs.stringify({
                        ...config.data,
                        token: store.getters["token"],
                    })
                }
            }
        }

        start()

        return config
    },
    (error) => {
        console.log(error)
        Promise.reject(error)
    }
)

//response拦截器
service.interceptors.response.use((response) => {
    const res = response.data
    if (response.status !== 200 && response.status !== 204) {
        ElMessage({
            message: res.msg,
            type: "error",
        })
        close()
        return Promise.reject("error")
    } else if (res.success == false) {
        ElMessage({
            message: res.msg,
            type: "error",
        })
        close()
        return Promise.reject("error")
    }
    close()
    return response.data
})

export default service
