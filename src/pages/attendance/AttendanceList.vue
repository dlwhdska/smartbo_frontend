<template>
    <main>
        <h3 class="title">근태내역</h3>
        <div class="action-buttons">
            <select id="selectBox" v-model="selectedMonth" class="select-month">
                <option value="">월 선택</option>
                <option v-for="month in months" :key="month.value" :value="month.value">
                    {{ month.label }}
                </option>
            </select>
            <button @click="fetchAttendanceData" class="fetch-button">조회</button>
        </div>
        <div class="attendance">
            <table>
                <thead>
                    <tr>
                        <th>일자</th>
                        <th>출근시간</th>
                        <th>퇴근시간</th>
                        <th>상태</th>
                    </tr>
                </thead>
                <tbody>
                    <AttendanceItem :a="a" v-if="attendanceList" v-for="a in attendanceList.content" :key="a.id" />
                </tbody>
            </table>
        </div>
        <br />
        <PageGroup v-if="attendanceList" :path="'/attendance/'"
            :currentPage="$route.params.currentPage ? $route.params.currentPage : 1" :startPage="startPage"
            :endPage="endPage" :totalPage="attendanceList.totalPages" />
    </main>
</template>
<script>
import AttendanceItem from "./AttendanceItem.vue";
import PageGroup from "@/components/PageGroup.vue";
import axios from "axios";
export default {
    name: "AttendanceList",
    // components: { AttendanceItem, PageGroup },
    components: { AttendanceItem, PageGroup },
    data() {
        return {
            currentPage: 1,
            attendanceList: null, // 페이지 그룹 초기화
            // attendanceList:[]
            startPage: 1,
            endPage: 1,
            selectedMonth: "", // 선택된 월 저장할 변수 추가
            months: [
                { value: "2023-01", label: "1월" },
                { value: "2023-02", label: "2월" },
                { value: "2023-03", label: "3월" },
                { value: "2023-04", label: "4월" },
                { value: "2023-05", label: "5월" },
                { value: "2023-06", label: "6월" },
                { value: "2023-07", label: "7월" },
                { value: "2023-08", label: "8월" },
                { value: "2023-09", label: "9월" },
                { value: "2023-10", label: "10월" },
                { value: "2023-11", label: "11월" },
                { value: "2023-12", label: "12월" },
            ],
            memberId : `${this.memberId}`,
        };
    },
    methods: {
        //----페이지그룹의 페이지(ex: [1] [2] [NEXT])객체가 클릭되었을 때 할 일 START----
        axiosHandler() {
            console.log("제발..{}", this.selectedMonth);
            // const memberId = localStorage.getItem("memberId");

            const url = `${this.backURL}/attendance/all?memberId=${this.memberId}&currentPage=${this.currentPage}`;
            axios
                .get(url)
                .then((response) => {
                    this.attendanceList = response.data;

                    console.log(this.attendanceList);

                    this.attendanceList.content.sort((a, b) => {
                        return b.id - a.id; // id 필드를 기준으로 내림차순 정렬
                    });

                    if (this.currentPage <= this.attendanceList.totalPages) {
                        this.startPage = parseInt((this.currentPage - 1) / 5) * 5 + 1;
                        this.endPage = this.startPage + 5 - 1;

                        if (this.endPage > this.attendanceList.totalPages) {
                            this.endPage = this.attendanceList.totalPages;
                        }
                    }

                    console.log("Sorted Data:", this.attendanceList.content);
                })
                .catch((error) => {
                    console.error("Error occurred:", error);
                });
        },
        //----페이지그룹의 페이지(ex: [1] [2] [NEXT])객체가 클릭되었을 때 할 일 END----

        // 월별 조회
        fetchAttendanceData() {
            const memberId = localStorage.getItem("memberId");

            const url = `${this.backURL}/attendance/date?attendanceDate=${this.selectedMonth}&memberId=${memberId}&currentPage=${this.currentPage}`;

            axios
                .get(url)
                .then((response) => {
                    this.attendanceList = response.data;

                    if (this.attendanceList.content && this.attendanceList.content.length > 0) {
                        this.attendanceList.content.sort((a, b) => {
                            return new Date(b.date) - new Date(a.date); // 날짜를 기준으로 오름차순 정렬
                        });
                    }

                    if (this.currentPage <= this.attendanceList.totalPages) {
                        this.startPage = parseInt((this.currentPage - 1) / 5) * 5 + 1;
                        this.endPage = Math.min(this.startPage + 4, this.attendanceList.totalPages);
                    }
                })
                .catch((error) => {
                    console.error("에러 발생", error);
                });

        },
    },
    watch: {
        // --- 라우터값이 변경되었을 때 할 일 START ---
        $route(newRoute, oldRoute) {
            console.log("라우터값이 변경" + newRoute.path + "," + oldRoute.path);
            if (newRoute.params.currentPage) {
                this.currentPage = newRoute.params.currentPage;
            } else {
                this.currentPage = 1;
            }
            // this.axiosHandler(this.currentPage)
            // this.axiosHandler()
            const isMonthlyClicked = this.selectedMonth !== "";

            console.log("월별2 : {}", isMonthlyClicked);

            if (isMonthlyClicked) {
                console.log("월별3 : {}", isMonthlyClicked);

                if (this.$route.params.currentPage) {
                    this.currentPage = this.$route.params.currentPage;
                }
                this.fetchAttendanceData();
            } else {
                console.log("월별4 : {}", isMonthlyClicked);

                if (this.$route.params.currentPage) {
                    this.currentPage = this.$route.params.currentPage;
                }
                this.axiosHandler();
            }
        },
        // --- 라우터값이 변경되었을 때 할 일 END ---
    },
    created() {
        // if (this.$route.params.currentPage) {
        //     this.currentPage = this.$route.params.currentPage
        // }
        // this.axiosHandler()

        const isMonthlyClicked = this.selectedMonth !== "";
        
        if (isMonthlyClicked) {
            console.log("월별3 : {}", isMonthlyClicked);

            if (this.$route.params.currentPage) {
                this.currentPage = this.$route.params.currentPage;
            }
            this.fetchAttendanceData();
        } else {
            console.log("월별4 : {}", isMonthlyClicked);

            if (this.$route.params.currentPage) {
                this.currentPage = this.$route.params.currentPage;
            }
            this.axiosHandler();
        }
    },
};
</script>
<style scoped>
.title {
    text-align: center;
    font-size: 28px;
    color: #2c3e50;
    text-transform: uppercase;
    margin-top: 100px;
    margin-bottom: 20px;
    font-weight: bold;
    text-shadow: 1px 1px 1px #ccc;
}

.attendance {
    width: 90%;
    font-family: "Arial", sans-serif;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 20px;
    margin: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-left: 6%;
    /* width: 1450px; */
    /* max-width: 1300px; */
    /* width: 90% */
}

h2 {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
}

table {
    width: 100%;
    border-collapse: collapse;
}

td {
    padding: 10px;
    text-align: center;
    border-bottom: 1px solid #ddd;
}

thead {
    text-align: center;
    background-color: #f5f5f5;
}

tbody tr:nth-child(even) {
    background-color: #f9f9f9;
}

tbody tr:hover {
    background-color: #eaeaea;
}

/* 월별 검색 */
.action-buttons {
    align-items: center;
    justify-content: flex-end; /* 오른쪽으로 보내기 */
    margin-left: 85%;
}

.select-month {
    margin-right: 10px;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
    background-color: #fff;
    font-size: 14px;
    color: #333;
}

.fetch-button {
    padding: 8px 20px;
    border: none;
    border-radius: 5px;
    background-color: #3498db;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.fetch-button:hover {
    background-color: #27ae60;
}
</style>
