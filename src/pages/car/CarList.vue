<template lang="">
    <main>
        <div class="car-header">
            <ul>
                <li class="current"><span class="headermenu-c" @click="reload">차량 예약</span></li>
                <li class="other"><router-link class="headermenu" to="/carrent/myrentlist">내 신청 내역</router-link></li>
            </ul>
        </div>
        <h3>차량 예약</h3>
        <div style="text-align: center;">
                <div class="dateselect">
                    <label style="font-weight: 700; font-size: 15px;">대여기간 </label><input type="date" 
                        name="startDate" 
                        v-model="data.startDate"
                        :min="minStartDate" 
                        @input="inputHandler"
                        required>
                        <span style="margin-left:20px; font-weight: 700; font-size: 15px;">~</span> <input type="date" 
                        name="endDate" 
                        v-model="data.endDate" 
                        :min="minEndDate" 
                        required>
                    <button class="dateselectbutton" @click="dateSelectHandler">확인</button>
                </div>
            <div class="carlist">
                <table v-if="carlist" class="carlist-table">
                    <thead>
                        <tr>
                            <!-- <th>차대번호</th> -->
                            <th>차량번호</th>
                            <th>차종</th>
                            <th>비고</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody class="hover-effect">
                        <CarListItem
                                    :d="data" 
                                    :c="c"
                                    v-if="carlist.content"
                                    v-for="c in carlist.content"
                                    :key="c.id"/>
                    </tbody>
                </table>
            
            </div>
        </div>
            <PageGroup
                v-if="carlist" 
                :path="'/carrent/carlist/'"
                :currentPage="$route.params.currentPage ? $route.params.currentPage : 1"
                :totalPage="carlist.totalPages"
                :startPage="startPage"
                :endPage="endPage"

            />
    </main>
    
</template>
<script>
import CarListItem from '@/pages/car/CarListItem.vue'
import PageGroup from '@/components/PageGroup.vue'
import axios from 'axios'
export default {
    name: 'CarList',
    components: { CarListItem, PageGroup},
    data() {
        return {
            currentPage: 1,
            carlist: null,
            modalCheck : false,
            minStartDate: this.getCurrentDate(),
            minEndDate: this.getCurrentDate(),
            data : {
                startDate: this.getCurrentDate(),
                endDate: this.getCurrentDate()
            },
            startPage: 1,
            endPage : 1

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
        inputHandler() {
            // startDate 값이 변경될 때 minEndDate를 업데이트
            this.minEndDate = this.data.startDate
            console.log(this.minEndDate)
        },
        dateSelectHandler(){
            // this.data.startDate = this.startDate
            // this.data.endDate = this.endDate
    
            if(this.data.endDate<this.data.startDate){
                alert("올바른 날짜 기입이 아닙니다. 대여기간을 다시 확인하세요.")
                return false
            }
            this.$router.push("/carrent/carlist")
            this.currentPage = 1
            this.startPage = 1
            this.endPage = 1

            const url = `${this.backURL}/carrent/carlist/${this.currentPage}`
            axios.get(url,{params : this.data})
            .then(response=>{
                this.carlist = response.data
                console.log(this.carlist)
                // alert("dateSelectHandler this.carlist.totalPages:"  +this.carlist.totalPages)
                if(this.currentPage <=  this.carlist.totalPages){
                    this.startPage = parseInt((this.currentPage - 1 ) / 5) * 5+1
                    this.endPage = this.startPage + 5 - 1

                    if(this.endPage>this.carlist.totalPages){
                        this.endPage =this.carlist.totalPages
                    }
                }

                // alert("dateSelectHandler dstartPage:"  +this.startPage + ", endPage:" + this.endPage)
            })
            .catch((Error)=>{
                console.log(Error)
            })
        },
        pageSwitchHandler(){
            if(this.data.endDate<this.data.startDate){
                alert("올바른 날짜 기입이 아닙니다. 대여기간을 다시 확인하세요.")
                return false
            }

            const url = `${this.backURL}/carrent/carlist/${this.currentPage}`
            axios.get(url,{params : this.data})
            .then(response=>{
                this.carlist = response.data
                console.log(this.carlist)
                if(this.currentPage <=  this.carlist.totalPages){
                    this.startPage = parseInt((this.currentPage - 1 ) / 5) * 5+1
                    this.endPage = this.startPage + 5 - 1

                    if(this.endPage>this.carlist.totalPages){
                        this.endPage =this.carlist.totalPages
                    }
                }
            })
            .catch((Error)=>{
                console.log(Error)
            })
        },
        reload(){
            window.loacation.reload()
        }   
    },
    watch: {
        //----라우터값이 변경되었을 때 할 일 START----
        $route(newRoute, oldRoute) {
            console.log("라우터값이 변경" + newRoute.path + "," + oldRoute.path)
            if (newRoute.params.currentPage) {
                console.log( "newRoute.params.currentPage타입", typeof(newRoute.params.currentPage))
                this.currentPage =  parseInt(newRoute.params.currentPage)
            } else {
                this.currentPage = 1
            }
            this.pageSwitchHandler()
        }
        //----라우터값이 변경되었을 때 할 일 END----  
    },
    created() {
        console.log('created carlist data='+ this.data.startDate)
        if (this.$route.params.currentPage) {
            this.currentPage = this.$route.params.currentPage
        }
        this.dateSelectHandler()
    }
}
</script>
<style scoped>
h3{
    text-align: center;
    font-size: 28px;
    color: #2c3e50;
    text-transform: uppercase;
    margin-top: 50px;
    margin-bottom: 20px;
    font-weight: bold;
    text-shadow: 1px 1px 1px #ccc;
}
.car-header{
    margin-left: 6%;
}
.dateselect{
    width: 100%;
    margin-top : 50px;
    margin-bottom: 50px;
}
.carlist{
    /* font-family: "Arial", sans-serif; */
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 20px;
    margin: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-left: 6%;
    width: 90%;
}
.carlist-table {
    width: 100%;
    border-collapse: collapse;
}
thead {
    background-color: #f5f5f5;
}

.carlist-table th {
    text-align: center;
  /* padding: 25px;
  font-size: 15px;
  background-color: #f5f5f5; */
}
/* .carlist-table tbody tr:nth-child(even) {
    background-color: #f9f9f9;
} */
.myrentlistbutton{
    width : 200px;
    padding : 10px;
    margin-left : 400px;
    border : solid 3px black;
}
.dateselectbutton{
    margin-left: 20px;
    background-color: #2196f3;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
button:hover{
    background-color: #2189df;
}
tbody::v-deep tr:nth-child(even) {
    background-color: #f9f9f9;
}
input{
    margin-left: 20px;
    border : 1px solid #d8d8d8;
    height : 35px;
    font-size : 13px;
    padding : 10px;
    border-radius: 4px;
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
}
.headermenu-c{
    color: rgb(247, 247, 247);
    font-weight: 600;
}
li.other:hover{
    background-color:#fbfbfc;
}
</style>