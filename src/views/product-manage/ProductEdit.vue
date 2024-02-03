<template>
    <div>
        <el-page-header title="产品管理" @back="handleBack">
            <template #content>
                <span class="text-large font-600 mr-3"> 编辑产品 </span>
            </template>
        </el-page-header>
        <el-form ref="productFormRef" :model="productForm" :rules="productFormRules" label-width="80px" class="demo-ruleForm"
            status-icon>
            <el-form-item label="产品名称" prop="name">
                <el-input v-model="productForm.name" />
            </el-form-item>
            <el-form-item label="产品描述" prop="introduction">
                <el-input v-model="productForm.introduction" type="textarea" />
            </el-form-item>
            <el-form-item label="产品详细" prop="detail">
                <el-input v-model="productForm.detail" type="textarea" />
            </el-form-item>
            <el-form-item label="产品图片" prop="cover">
                <Upload :avatar="productForm.cover" @kerwinchange="handleChange"></Upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm()">更新产品</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup>
import {ref,reactive,onMounted} from 'vue'
import Editor from '@/components/editor/Editor.vue'
import Upload from '@/components/upload/Upload.vue';
import upload from '@/util/upload';
import {useRouter,useRoute} from 'vue-router';
import axios from 'axios';
import {useStore} from 'vuex';

const store = useStore()
const router = useRouter()
const route = useRoute()
const productFormRef = ref()
const productForm = reactive({
    name:"",
    introduction:"",
    detail:"",
    cover:"",
    file:null
})
const productFormRules = reactive({
    name:[{required:true,message:'请输入产品名称',trigger:'blur'}],
    introduction:[{required:true,message:'请输入产品简介',trigger:'blur'}],
    detail:[{required:true,message:'请输入产品详细',trigger:'blur'}],
    cover:[{required:true,message:'请上传产品图片',trigger:'blur'}],
})
const handleChange = (file) => {
    productForm.cover = URL.createObjectURL(file);
    productForm.file = file;
}
const submitForm = ()=>{
    productFormRef.value.validate(async (valid)=>{
        if(valid){
            await upload("adminapi/product/list",productForm);
            router.back();
        }
    })
}
const handleBack = ()=>{
    router.back()
}
onMounted(async()=>{
    const res = await axios.get(`adminapi/product/list/${route.params.id}`)
    Object.assign(productForm,res.data.data[0]);
})
</script>
<style lang="scss" scoped>
.el-form{
    margin-top: 50px;
}
</style>