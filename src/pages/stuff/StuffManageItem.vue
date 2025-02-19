<template lang="">
    <tr @click="trClickHandler(request.id)">
        <td>{{ request.reqDate }}</td>
        <td>{{ request.member.name }}</td>
        <td>{{ request.member.department.name }}</td>
        <td>{{ request.stuff.id }}</td>
        <td>{{ request.stuff.name }}</td>
        <td>{{ request.stuff.stock }}</td>
        <td>{{ request.quantity }}</td>
        <td>
            <span :class="{ 'processing': request.status === 0, 'completed': request.status === 1, 'rejected': request.status === 2 }">
                {{ request.status === 0 ? '대기' : request.status === 1 ? '승인' : '반려' }}
            </span>
        </td>
    </tr>
    <StuffManageItemModal 
    v-if="isModalVisible" 
    :request="selectedRowData" 
    @close="closeModal" />
</template>
<script>
import StuffManageItemModal from '@/pages/stuff/StuffManageItemModal.vue';
export default {
    components: { StuffManageItemModal },
    props: {
        request: Object,
    },
    data() {
        return {
            isModalVisible: false,
            selectedRowData: null,
        }
    },
    methods: {
        trClickHandler() {
            this.selectedRowData = this.request;
            this.isModalVisible = true;
        },
        closeModal() {
            this.isModalVisible = false;
        },
    },
}
</script>
<style scoped>
tr:nth-child(even) {
    background-color: #f9f9f9;
}

tr:hover {
    background-color: #fcfcfc;
}

td {
    padding: 10px;
    text-align: center;
    border-bottom: px solid #ddd;
    border-top: dotted 1px #cccccc;
    font-size: 15px;
    cursor: pointer;
}
.processing,
.completed,
.rejected {
    color: white;
    border-radius: 15px;
    padding: 20px;
    padding-top: 5px;
    padding-bottom: 5px;
    font-size: 12px;
}

.processing {
    background-color: rgb(255, 217, 0);
}

.completed {
    background-color: rgb(25, 189, 74);
}

.rejected {
    background-color: rgb(252, 49, 49);
}
</style>