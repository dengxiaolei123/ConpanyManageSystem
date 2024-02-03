<template>
    <div>
        <el-card>
            <el-page-header icon="none" title="产品管理">
                <template #content>
                    <span class="text-large font-600 mr-3"> 产品列表 </span>
                </template>
            </el-page-header>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="name" label="产品名称" width="180" />
                <el-table-column label="产品描述" prop="introduction" width="180" />
                <el-table-column label="创建时间" prop="createTime" width="180">
                    <template #default="scope">
                        {{ formatTime.getTime(scope.row.createTime) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template #default="scope">
                        <el-button circle :icon="Search" type="success" @click="handlePreview(scope.row)"></el-button>
                        <el-button circle :icon="Edit" @click="handleEdit(scope.row)"></el-button>
                        <el-popconfirm title="你确定要删除吗？" confirm-button-text="确定" cancel-button-text="取消"
                            @confirm="handleDelete(scope.row)">
                            <template #reference>
                                <el-button circle :icon="Delete" type="danger"></el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog v-model="dialogVisible" title="预览产品" width="50%">
            <div class="productcontent">
                <h2>{{ previewData.name }}</h2>
                <img :src="'http://localhost:3000'+previewData.cover" alt="">
            </div>
        </el-dialog>
    </div>
</template>
<script setup>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue'
import formatTime from '@/util/formatTime'
import { Search, Edit, Delete } from '@element-plus/icons-vue'
import {useRouter}  from 'vue-router'


const router = useRouter()
const tableData = ref([])
const previewData = ref({})
const dialogVisible = ref(false)
onMounted(() => {
    getTableData()
})
const getTableData = async () => {
    const res = await axios.get(`/adminapi/product/list`)
    tableData.value = res.data.data
}
const handlePreview = (data) => {
    previewData.value = data
    dialogVisible.value = true
}
const handleDelete = async (item) => {
    await axios.delete(`adminapi/product/list/${item._id}`)
    await getTableData()
}
const handleEdit = (item)=>{
    router.push(`/product-manage/productedit/${item._id}`)
}
</script>
<style lang="scss" scoped>
::v-deep .productcontent {
    img {
        max-width: 100%
    }
}
</style>