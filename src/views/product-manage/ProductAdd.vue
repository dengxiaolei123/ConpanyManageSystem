<template>
    <div>
        <el-page-header icon="none" title="产品管理">
            <template #content>
                <span class="text-large font-600 mr-3"> 添加产品 </span>
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
                <el-button type="primary" @click="submitForm()">添加产品</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import Upload from '@/components/upload/Upload.vue'
import upload from '@/util/upload';
import { useRouter } from 'vue-router';
import {useStore} from 'vuex'
const store = useStore()

const router = useRouter()
const productFormRef = ref()
const productForm = reactive({
    name: "",
    introduction: "",
    detail: "",
    cover:"",
    file: null
})
const productFormRules = reactive({
    name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
    introduction: [{ required: true, message: '请输入产品描述', trigger: 'blur' }],
    detail: [{ required: true, message: '请输入产品详细', trigger: 'blur' }],
    cover: [{ required: true, message: '请上传产品图片', trigger: 'blur' }],
})
//每次选择完图片之后的回调
const handleChange = (file) => {
    productForm.cover = URL.createObjectURL(file);
    productForm.file = file;
}
const submitForm = ()=>{
    productFormRef.value.validate(async (valid) => {
        if(valid){
            //提交数据到后端
            await upload("adminapi/product/add",productForm)
            router.push ("/product-manage/productlist")
        }
    })
}
</script>
<style lang="scss" scoped>
.demo-ruleForm {
    margin-top: 50px;
}
</style>