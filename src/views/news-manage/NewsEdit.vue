<template>
    <div>
        <el-page-header title="新闻管理" @back="handleBack">
            <template #content>
                <span class="text-large font-600 mr-3"> 编辑新闻 </span>
            </template>
        </el-page-header>
        <el-form ref="newsFormRef" :model="newsForm" :rules="newsFormRules" label-width="80px" class="demo-ruleForm"
            status-icon>
            <el-form-item label="标题" prop="title">
                <el-input v-model="newsForm.title" />
            </el-form-item>
            <el-form-item label="内容" prop="content">
                <Editor @textChange="handletextChange" :content="newsForm.content" v-if="newsForm.content"></Editor>
            </el-form-item>
            <el-form-item label="类别" prop="category">
                <el-select v-model="newsForm.category" class="m-2" placeholder="Select" style="width: 100%">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="封面" prop="cover">
                <Upload :avatar="newsForm.cover" @kerwinchange="handleChange"></Upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm()">更新新闻</el-button>
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
const newsFormRef = ref()
const newsForm = reactive({
    title:"",
    content:"",
    category:1,   //1.最新动态2.典型案例3.通知公告
    cover:"",
    file:null,
    isPublish:0, //0.未发布1.已发布
    username:""
})
const newsFormRules = reactive({
    title:[{ required: true, message: '请输入标题', trigger: 'blur' }],
    content:[{ required: true, message: '请输入内容', trigger: 'blur' }],
    category:[{ required: true, message: '请选择分类', trigger: 'blur' }],
    cover:[{ required: true, message: '请上传封面', trigger: 'blur' }]
})
const options = ref([
    {
        label:'最新动态',
        value:1
    },
    {
        label:'典型案例',
        value:2
    },
    {
        label:'通知公告',
        value:3
    }
])
const handletextChange = (text)=>{
    newsForm.content = text;
}
const handleChange = (file) => {
    newsForm.cover = URL.createObjectURL(file);
    newsForm.file = file;
}
const submitForm = ()=>{
    newsFormRef.value.validate(async (valid)=>{
        if(valid){

            await upload("adminapi/news/list",newsForm);
            router.back();
        }
    })
}
const handleBack = ()=>{
    router.back()
}
onMounted(async()=>{
    const res = await axios.get(`adminapi/news/list/${store.state.userInfo.username}/${route.params.id}`)
    Object.assign(newsForm,res.data.data[0]);
})
</script>
<style lang="scss" scoped>
.el-form{
    margin-top: 50px;
}
</style>