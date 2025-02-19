<template lang="">
    <main>
        <div class="car-header">
                <ul>
                    <li class="other"><router-link class="headermenu" to="/carrent/carlist">차량 예약</router-link></li>
                    <li class="current"><span class="headermenu-c" >내 신청 내역</span></li>
                </ul>
        </div>
        <h3>내 신청 내역</h3>
        <div class="myrentlist">
            <table>
                <thead>
                    <tr>
                        <th>신청날짜</th>
                        <th>대여목적</th>
                        <th>대여기간</th>
                        <th>처리상태</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <CarMyRentListItem :m="m"
                                v-if="myrentlist"
                                v-for="m in myrentlist.content"
                                :key="m.id"/>
                </tbody>
            </table>
        </div>
            <PageGroup
                v-if="myrentlist" 
                :path="'/carrent/myrentlist/'"
                :currentPage="$route.params.currentPage ? $route.params.currentPage : 1"
                :totalPage="myrentlist.totalPages"
                :startPage="startPage"
                :endPage="endPage"
            />
    </main>
</template>
<script>
import CarMyRentListItem from '@/pages/car/CarMyRentListItem.vue'
import PageGroup from '@/components/PageGroup.vue'
import axios from 'axios'
export default {
    name: 'CarMyRentList',
    components: { CarMyRentListItem, PageGroup},
    data() {
        return {
            currentPage: 1,
            myrentlist: null,
            modalCheck : false,
            startPage: 1,
            endPage : 1
        }
    },
    methods: {
        //----페이지그룹의 페이지(ex: [1] [2] [NEXT])객체가 클릭되었을 때 할 일 START----   
        axiosHandler() {
            const memberId = localStorage.getItem('memberId')
            const url = `${this.backURL}/carrent/myrentlist?memberId=${memberId}&currentPage=${this.currentPage}`
            axios.get(url)
            .then(response=>{
                this.myrentlist = response.data
                if(this.currentPage <=  this.myrentlist.totalPages){
                    this.startPage = parseInt((this.currentPage - 1 ) / 5) * 5+1
                    this.endPage = this.startPage + 5 - 1

                    if(this.endPage>this.myrentlist.totalPages){
                        this.endPage =this.myrentlist.totalPages
                    }
                }
                console.log(this.myrentlist)
                // this.myrentlist.content.reqDate = this.formatToYYYYMMDD(this.myrentlist.content.reqDate)
                // this.myrentlist.content.startDate = this.formatToYYYYMMDD(this.myrentlist.content.startDate)
                // this.myrentlist.content.endDate = this.formatToYYYYMMDD(this.myrentlist.content.endDate)
                // console.log(this.myrentlist.content.reqDate)
            })
            .catch((Error)=>{
                console.log(Error)
            })
        },
        //----페이지그룹의 페이지(ex: [1] [2] [NEXT])객체가 클릭되었을 때 할 일 END----
        formatToYYYYMMDD(date) {
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
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
            this.axiosHandler(this.currentPage)
        }
        //----라우터값이 변경되었을 때 할 일 END----     
    },
    created() {
        console.log('created myrentlist')
        if (this.$route.params.currentPage) {
            this.currentPage = this.$route.params.currentPage
        }
        this.axiosHandler(this.currentPage)
    }
}
</script>
<style scoped>
.car-header{
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
.myrentlist{
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 20px;
    margin: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-left: 6%;
    width: 90%;
}
.myrentlist>table{
    width: 100%;
    border-collapse: collapse;
}
thead {
    background-color: #f5f5f5;
}
th{
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