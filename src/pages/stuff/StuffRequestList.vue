<template>
    <div class="list-container">
        <h3 class="title">비품 요청 목록조회</h3>
        <br>
        <div class="form-container">
            <div class="form-group">
                <label for="startDatePicker">시작 날짜:</label>
                <input type="date" id="startDatePicker" v-model="startDate" />
            </div>
            <div class="form-group">
                <label for="endDatePicker">종료 날짜:</label>
                <input type="date" id="endDatePicker" v-model="endDate" />
            </div>
            <div class="form-group">
                <label for="statusSelect">요청상태:</label>
                <select id="statusSelect" v-model="status">
                    <option value="0">승인대기</option>
                    <option value="1">승인</option>
                    <option value="2">반려</option>
                    <option value="3">전체선택</option>
                </select>
            </div>
            <div class="form-group">
                <label for="categorySelect">대분류:</label>
                <select id="categorySelect" v-model="category">
                    <option value="default">선택안함</option>
                    <option value="S">문구류</option>
                    <option value="F">가구류</option>
                </select>
            </div>
            <div class="form-group">
                <label for="subcategorySelect">소분류:</label>
                <select id="subcategorySelect" v-model="subcategory">
                    <option v-if="category === 'S'" value="S0001">A4</option>
                    <option v-if="category === 'S'" value="S0002">B4</option>
                    <option v-if="category === 'S'" value="S0003">볼펜</option>
                    <option v-if="category === 'S'" value="S0004">클립</option>
                    <option v-if="category === 'F'" value="F0001">책상</option>
                    <option v-if="category === 'F'" value="F0002">의자</option>
                    <option v-if="category === 'F'" value="F0003">파티션</option>
                    <option v-if="category === 'E'" value="E0001"> </option>
                </select>
            </div>
            <button @click="loadData" class="load-button">목록 로드</button>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>요청날짜</th>
                        <th>비품번호</th>
                        <th>비품명</th>
                        <th>요청수량</th>
                        <th>요청사유</th>
                        <th>처리현황</th>
                        <th>반려사유</th>
                    </tr>
                </thead>
                <tbody>
                    <StuffRequestListItem :request="request" v-if="reqList" v-for="request in reqList" :key="request.id" />
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import StuffRequestListItem from '@/pages/stuff/StuffRequestListItem.vue'
import axios from 'axios'
export default {
    components: { StuffRequestListItem },
    props: {
        memberId: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            category: 'default', // 대분류 선택값
            subcategory: '', // 소분류 선택값
            status: 3,
            stuffId: 'default',
            startDate: this.getCurrentDate(),
            endDate: this.getCurrentDate(),
            reqList: [],
        }
    },
    methods: {

        getCurrentDate() {
            const today = new Date()
            const year = today.getFullYear()
            const month = String(today.getMonth() + 1).padStart(2, '0')
            const day = String(today.getDate()).padStart(2, '0')
            return `${year}-${month}-${day}`
        },

        loadData() {
            if (!this.startDate || !this.endDate) {
                alert('올바른 요청이 아닙니다. 시작 날짜와 종료 날짜를 선택하세요.');
                return;
            }

            if (this.endDate < this.startDate) {
                alert("올바른 날짜 선택이 아닙니다. 선택기간을 다시 확인하세요.")
                return false
            }

            const url = `${this.backURL}/stuff/requestlist`;

            const params = {
                memberId: this.memberId,
                status: this.status,
                stuffId: this.stuffId,
                startDate: this.startDate,
                endDate: this.endDate
            };
            // 소분류가 선택된 경우
            if (this.category !== 'default') {
                params.stuffId = this.subcategory;
            }

            axios.get(url, {
                params: params,
                withCredentials: true
            })
                .then(response => {
                    this.reqList = response.data;
                })
                .catch(error => {
                    alert('목록 로드 실패')
                });
        },
    },

    created() {
        this.loadData()
    },

}
</script>
<style scoped>
.title {
    text-align: center;
    font-size: 28px;
    color: #2c3e50;
    text-transform: uppercase;
    font-weight: bold;
    text-shadow: 1px 1px 1px #ccc;
}

.list-container {
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 20px;
    background-color: white;
    box-shadow: 1px 1px 15px 6px rgb(231, 231, 231);
}

.table-container {
    min-height: 190px;
    max-height: 300px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
    overflow-y: auto;
}

.table-container>table {
    width: 100%;
    border-collapse: collapse;
}

thead {
    background-color: #f5f5f5;
}

th {
    text-align: center;
}

.form-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.form-group {
    margin-bottom: 15px;
}

label {
    font-weight: bold;
    margin-right: 8px;
}

input,
select {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-right: 8px;
}

.load-button {
    height: 35px;
    background-color: #2196F3;
    border: none;
    color: white;
    padding: 5px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
}

.load-button:hover {
    background-color: #2189df;
}
</style>