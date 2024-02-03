<template>
    <div>
        <el-card>
            <el-page-header icon="none" title="新闻管理">
                <template #content>
                    <span class="text-large font-600 mr-3"> 新闻列表 </span>
                </template>
            </el-page-header>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="title" label="标题" width="180" />
                <el-table-column label="类别" prop="category" width="180">
                    <template #default="scope">
                        {{ categoryFormat(scope.row.category) }}
                    </template>
                </el-table-column>
                <el-table-column label="更新时间" prop="editTime" width="180">
                    <template #default="scope">
                        {{ formatTime.getTime(scope.row.editTime) }}
                    </template>
                </el-table-column>
                <el-table-column label="是否发布" prop="isPublish" width="180">
                    <template #default="scope">
                        <el-switch v-model="scope.row.isPublish" @change="handleSwitchChange(scope.row)" :active-value="1"
                            :inactive-value="0" />
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
        <el-dialog v-model="dialogVisible" title="预览新闻" width="50%">
            <div>
                <h2>{{ previewData.title }}</h2>
                <div>{{ formatTime.getTime(previewData.editTime) }}</div>
                <el-divider />
                <div v-html="html" class="htmlcontent"></div>
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
import {useStore} from 'vuex'

const store = useStore()
const router = useRouter()
const tableData = ref([])
const previewData = ref({})
const html = computed(() => previewData.value.content.replace('/</g', "&lt;").replace('/>/g', "&gt;"))
const dialogVisible = ref(false)
onMounted(() => {
    getTableData()
})
const getTableData = async () => {
    const res = await axios.get(`/adminapi/news/list/${store.state.userInfo.username}`)
    tableData.value = res.data.data
}
const categoryFormat = (category) => {
    const arr = ["最新动态", "典型案例", "通知公告"]
    return arr[category - 1]
}
const handleSwitchChange = async (item) => {
    await axios.put(`adminapi/news/publish`, {
        _id: item._id,
        isPublish: item.isPublish
    })
    await getTableData()
}
const handlePreview = (data) => {
    previewData.value = data
    dialogVisible.value = true
}
const handleDelete = async (item) => {
    await axios.delete(`adminapi/news/list/${item._id}`)
    await getTableData()
}
const handleEdit = (item)=>{
    router.push(`/news-manage/newsedit/${item._id}`)
}
</script>
<style lang="scss" scoped>
::v-deep .htmlcontent {
    img {
        max-width: 100%
    }
}
</style>