<template>
    <main>
    <h3 class="title">회의 예약내역</h3>
    <div class="myreservationlist">
        <table>
            <thead>
                <tr>
                <th>구역</th>
                <th>회의실</th>
                <th>예약시간</th>
                <th>상태</th>
                </tr>
            </thead>

            <tbody>
                <MeetingRoomResItem 
                    :mrr="mrr"
                    v-if="meetingroomreslist.content"
                    v-for="mrr in meetingroomreslist.content" 
                    v-bind:key="mrr.id"
                />
            </tbody>
        </table>
    </div>
    <br>
        <PageGroup 
        v-if="meetingroomreslist" 
        :path="'/meetingroom/myreservation/'"
        :currentPage="$route.params.currentPage ? $route.params.currentPage : 1"
        :startPage="startPage"
        :endPage="endPage"
        />
    </main>
</template>
<script>
import MeetingRoomResItem from '@/pages/meetingroom/MeetingRoomResItem.vue'
import PageGroup from '@/components/PageGroup.vue'
import axios from 'axios'

export default {
    name: "MeetingRoomResList",
    components: { MeetingRoomResItem, PageGroup },
    data() {
        return {
            meetingroomreslist : {
                content: [],
            },    
            currentPage: 1,
            startPage: 1,
            endPage: 1,
        }
    }, 
    methods: {
        //----페이지그룹의 페이지(ex: [1] [2] [NEXT])객체가 클릭되었을 때 할 일 START----   
        axiosHandler() {
            const memberId = localStorage.getItem('memberId');
            const url = `${this.backURL}/meetingroom/myreservation/${this.currentPage}?memberId=${memberId}`
            axios.get(url)
            .then(response=>{
                this.meetingroomreslist = response.data;
                if(this.currentPage <=  this.meetingroomreslist.totalPages){
                    this.startPage = parseInt((this.currentPage - 1 ) / 5) * 5+1
                    this.endPage = this.startPage + 5 - 1

                    if(this.endPage>this.meetingroomreslist.totalPages){
                        this.endPage =this.meetingroomreslist.totalPages
                    }
                }
                console.log(startPage+' '+endPage)
            })
            .catch((error) =>{
                console.log(error)
            })
        },
        //----페이지그룹의 페이지(ex: [1] [2] [NEXT])객체가 클릭되었을 때 할 일 END----

        //----리스트 중 한 항목 클릭되었을 때 할 일 START----
        clickMeetingRoomResInfo(id) {
            this.id = id;
        },
    },
    watch: {
        //----라우터값이 변경되었을 때 할 일 START----
        $route(newRoute, oldRoute) {
            console.log("라우터값이 변경" + newRoute.path + "," + oldRoute.path)
            if (newRoute.params.currentPage) {
                this.currentPage = newRoute.params.currentPage
            } else {
                this.currentPage = 1
            }
            this.axiosHandler()
        }
        //----라우터값이 변경되었을 때 할 일 END----
    },
    created() {
        console.log('created myreservationlist')
        if (this.$route.params.currentPage) {
            this.currentPage = this.$route.params.currentPage
        }
        this.axiosHandler()
    },
}
</script>
<style scoped>
/* 페이지 제목 */
.title {
    text-align: center;
    font-size: 28px;
    color: #2c3e50;
    text-transform: uppercase;
    margin-top: 100px;
    margin-bottom: 30px;
    font-weight: bold;
    text-shadow: 1px 1px 1px #ccc;
}

/* 내용 */
.myreservationlist {

    width: 90%;
    font-family: "Arial", sans-serif;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 20px;
    margin: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-left: 6%;
}

table {
  border-collapse: collapse;
  width: 100%;

  align-content: center;
}

td {
    padding: 10px;
    text-align: center;
    border-bottom: 1px solid #ddd;
}

thead {
    background-color: #f5f5f5;
}

tbody tr:nth-child(even) {
    background-color: #f9f9f9;
}

tbody tr:hover {
    background-color: #eaeaea;
}

/* 테이블 행 */
th{
  padding: 8px;
  height: 80px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

/* 테이블 비율 */
th:nth-child(1),
td:nth-child(1) {
  width: 20%;
}

th:nth-child(2),
td:nth-child(2) {
  width: 20%;
}

th:nth-child(3),
td:nth-child(3) {
  width: 40%;
}

th:nth-child(4),
td:nth-child(4) {
  width: 20%;
}

tr:nth-child(even) {
  background-color: #fff6f6;
}

</style>