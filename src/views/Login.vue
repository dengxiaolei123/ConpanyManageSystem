<template>
    <div>
        <particles></particles>
        <div class="formContainer">
            <h3>企业门户网站管理系统</h3>
            <el-form ref="loginFormRef" :model="loginForm" status-icon :rules="loginRules" label-width="120px"
                class="loginForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="loginForm.username" autocomplete="off" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="loginForm.password" type="password" autocomplete="off" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script setup>
import {reactive,ref} from 'vue'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'
import Particles from '../../index.vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const store = useStore()
const loginForm = reactive({
    username:"",
    password:""
})//表单绑定的响应式对象
const loginFormRef = ref()//表单引用对象
const loginRules = reactive({
    username:[
        {
            required:true,message:"请输入用户名",trigger:"blur"
        }
    ],
    password:[
        {
            required:true,message:"请输入密码",trigger:"blur"
        }
    ]
})
const router = useRouter()
const submitForm = ()=>{
    //1.校验表单
    //2.拿到表单内容，提交后台
    loginFormRef.value.validate(valid=>{
        if(valid){

            axios.post("/adminapi/user/login",loginForm).then(res=>{
                console.log(res.data);
                if(res.data.ActionType==="OK"){
                    store.commit("changeUserInfo",res.data.data)
                    store.commit("changeGetterRouter",false)
                    router.push("/index")
                }else{
                    ElMessage.error('用户名和密码不匹配')
                }
            })

        }
    })


    //3.设置token
}
</script>
<style lang="scss" scoped>
.formContainer{
    width:500px;
    height: 300px;
    position: fixed;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
    background: rgba($color:#000000, $alpha:0.5);
    color:white;
    text-align: center;
    padding: 20px;
    h3{
        font-size: 30px;
    }
    .loginForm{
        margin-top: 20px;
    }
    
}
::v-deep .el-form-item__label{
    color:white;
}
</style>