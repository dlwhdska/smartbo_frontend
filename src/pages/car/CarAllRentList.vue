<template lang="">
<main>
    <div class="allrentheader">
            <ul>
                <li class="other"><router-link class="headermenu" to="/carrent/manage">차량 관리</router-link></li>
                <li class="current"><span class="headermenu-c" >신청 내역</span></li>
            </ul>
    </div>
    <h3>신청 내역</h3>
    <div class="allrentlist">
        <table>
            <thead>
                <tr>
                    <th>신청날짜</th>
                    <th>소속부서</th>
                    <th>예약자</th>
                    <th>차량번호</th>
                    <th>대여기간</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <CarAllRentListItem :r="r"
                            v-if="allrentlist"
                            v-for="r in allrentlist.content"
                            :key="r.id"/>
            </tbody>
        </table>
    </div>
    <div>
        <PageGroup
            v-if="allrentlist" 
            :path="'/carrent/allrentlist/'"
            :currentPage="$route.params.currentPage ? $route.params.currentPage : 1"
            :startPage="startPage"
            :endPage="endPage"
            :totalPage="allrentlist.totalPages"
        />
    </div>
</main>
</template>
<script>
import CarAllRentListItem from '@/pages/car/CarAllRentListItem.vue'
import PageGroup from '@/components/PageGroup.vue'
import axios from 'axios'
export default {
    name: 'CarAllRentList',
    components: { CarAllRentListItem, PageGroup},
    data() {
        return {
            currentPage: 1,
            allrentlist: null,
            modalCheck : false,
            startPage : 1,
            endPage : 1
        }
    },
    methods: {
        //----페이지그룹의 페이지(ex: [1] [2] [NEXT])객체가 클릭되었을 때 할 일 START----   
        axiosHandler() {
            const url = `${this.backURL}/carrent/allrentlist/${this.currentPage}`
            axios.get(url)
            .then(response=>{
                this.allrentlist = response.data
                console.log('rentlist: ',this.allrentlist)
                console.log(response.data.totalPages)
                if(this.currentPage <=  this.allrentlist.totalPages){
                    this.startPage = parseInt((this.currentPage - 1 ) / 5) * 5+1
                    this.endPage = this.startPage + 5 - 1

                    if(this.endPage>this.allrentlist.totalPages){
                        this.endPage =this.allrentlist.totalPages
                    }
                }
                console.log(startPage+' '+endPage)
            })
            .catch((Error)=>{
                console.log(Error)
            })
        },
        //----페이지그룹의 페이지(ex: [1] [2] [NEXT])객체가 클릭되었을 때 할 일 END----
        openRejectModal() {
            this.rejectModalCheck = !this.rejectModalCheck
        },
        openApproveModal() {
            this.approveModalCheck = !this.approveModalCheck
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
        console.log('created allrentlist')
        if (this.$route.params.currentPage) {
            this.currentPage = this.$route.params.currentPage
        }
        this.axiosHandler()
    }
}
</script>
<style scoped>
.allrentheader{
    margin-left: 6%;
}
h3{
    text-align: center;
    font-size: 28px;
    color: #2c3e50;
    text-transform: uppercase;
    margin-top: 50px;
    margin-bottom: 50px;
    font-weight: bold;
    text-shadow: 1px 1px 1px #ccc;
}
.allrentlist{
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 20px;
    margin: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-left: 6%;
    width: 90%;
}
table{
    width: 100%;
    border-collapse: collapse;
}
thead {
    background-color: #f5f5f5;
}
th {
    text-align: center;
}
ul{
    list-style-type: none;
    padding:0;
    text-align: center;
    display: inline-block;
    margin: 0;
}
li.current{
    background-color: #1565c0;
    border : solid 1px rgb(190, 205, 255);
}
li.other{
    background-color: white;
    border: solid 1px rgb(200, 200, 201);
}
li{
    /* display: inline; */
    width: 150px;
    height : 50px;
    display: inline-block;
    text-align: center;
    padding-top: 10px;
    border-radius: 6px;
    margin-left: 20px;
    cursor: pointer;
}
.headermenu{
    text-decoration: none;
    color: rgb(23, 29, 110);
    font-weight: 600;
    padding:10px;
}
.headermenu-c{
    color: rgb(247, 247, 247);
    font-weight: 600;
}
li.other:hover{
    background-color:#fbfbfc;
}
</style>