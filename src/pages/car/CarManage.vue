<template lang="">
<main>
        <div class="manageheader">
            <ul>
                <li class="current"><span class="headermenu-c" @click="menuHandler(0)">차량 관리</span></li>
                <li class="other"><router-link class="headermenu" to="/carrent/allrentlist">신청 내역</router-link></li>
            </ul>
        </div>
        <h3>차량 관리</h3>
    <div class="carmanage" style="text-align: center; width: 100%; height:100%;">
            <div class="optionbuttons">
                <div class="optionbutton" @click="menuHandler(1)">
                    <div class="option-text">
                        <router-link class="a" to="/carrent/manage/">승인대기</router-link><br><br>
                        <span :bind="waitingcnt">{{waitingcnt}}</span>
                    </div>
                </div>
                <div class="optionbutton" @click="menuHandler(2)">
                    <div class="option-text">
                        <router-link class="a" to="/carrent/manage/">대여중</router-link><br><br>
                        <span :bind="rentcnt">{{rentcnt}}</span>
                    </div>
                </div>
                <div class="optionbutton" @click="menuHandler(3)">
                    <div class="option-text">
                        <router-link class="a" to="/carrent/manage/">미반납</router-link><br><br>
                        <span :bind="noreturncnt">{{noreturncnt}}</span>
                    </div>
                </div>
            </div>
            
            <CarManageList v-if="menu==0 && load==1"
                            :rentlist="rentlist"
                            :noreturnlist="noreturnlist"/>
            <CarWaitingList v-if="menu==1"/>
            <CarRentList v-if="menu==2"/>
            <CarNoReturnList v-if="menu==3"/>
    </div>
</main>
</template>
<script>
import CarManageList from '@/pages/car/CarManageList.vue'
import CarWaitingList from '@/pages/car/CarWaitingList.vue'
import CarRentList from '@/pages/car/CarRentList.vue'
import CarNoReturnList from '@/pages/car/CarNoReturnList.vue'
import CarsMap from '@/pages/car/CarsMap.vue'
import PageGroup from '@/components/PageGroup.vue'
import axios from 'axios'
export default {
    name: 'CarManage',
    components: { CarManageList, CarWaitingList, CarRentList, CarNoReturnList, PageGroup, CarsMap },
    data() {
        return {
            carlist: null,
            rentlist: null,
            waitinglist : null,
            noreturnlist : null,
            rentcnt : 0,
            waitingcnt : 0,
            noreturncnt : 0,
            menu : 0,
            intervalid: 0,
            load : 0
        }
    },
    methods: {
        //----페이지그룹의 페이지(ex: [1] [2] [NEXT])객체가 클릭되었을 때 할 일 START----   
        axiosHandler() {
            this.load = 0;
            console.log('axios 호출 시작');
            const url = `${this.backURL}/carrent/manage`;
            axios.get(url)
                .then(response => {
                    this.carlist = response.data.carlist;
                    this.waitinglist = response.data.waitinglist;
                    this.rentlist = response.data.rentlist;
                    this.noreturnlist = response.data.noreturnlist;
                    console.log("manage carlist: ", this.carlist);
                    console.log("manage waitinglist: ", this.waitinglist);
                    console.log("manage rentlist: ", this.rentlist);
                    console.log("manage noreturnlist: ", this.noreturnlist);
                    if (this.waitinglist != null) {
                        console.log('cnt값 구하기 시작');
                        this.waitingcnt = this.waitinglist.length;
                    }
                    if (this.rentlist != null) {
                        this.rentcnt = this.rentlist.length;
                    }
                    if (this.noreturnlist != null) {
                        this.noreturncnt = this.noreturnlist.length;
                    }
                    console.log(this.waitingcnt);
                    console.log(this.noreturncnt);
                    console.log('axios 호출 완료');

                    this.load = 1;
                })
                .catch((Error) => {
                    console.log(Error);
                });
        },
        //----페이지그룹의 페이지(ex: [1] [2] [NEXT])객체가 클릭되었을 때 할 일 END----
        menuHandler(menu) {
            this.menu = menu;
            this.$router.push({ path: '/carrent/manage' });
        },
    },
    created() {
        console.log('created carmanage');
        this.axiosHandler();
    },
    beforeRouteLeave(to, from, next) {
        console.log('찍히니?');
        next(); // 컴포넌트가 파괴되기 전에 setInterval 중지
    },
}

</script>
<style scoped>
.manageheader{
    margin-left: 6%;
}
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
.optionbuttons{
    text-align: center;
    width:100%;
    margin-top : 30px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.optionbutton{
    width : 200px;
    height : 200px;
    text-align: center;
    float : left;

    margin : 50px;
    border : solid 10px transparent;/*#1fd3d37a ;*/
    cursor : pointer;
    border-radius : 50%;
    /* background-image: linear-gradient(#fff, #fff), linear-gradient(90deg, rgba(56,209,209,1) 0%, rgba(205,252,252,1) 35%, rgba(153,223,237,1) 100%); */
    background-image : linear-gradient(#fff, #fff), linear-gradient(90deg, rgba(87,162,249,1) 0%, rgba(221,242,255,1) 35%, rgba(153,217,237,1) 100%);
    background-origin: border-box;
    background-clip: content-box, border-box;
    box-shadow: 0 5px 30px #ddebf7;
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
li.other:hover{
    background-color:#fbfbfc;
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
.a{
    text-decoration: none;
    font-size: 25px;
    font-weight: 1000;
    color : rgb(57, 88, 97);
}
.option-text{
    padding-top : 50px;
}
.option-text>span{
    text-decoration: none;
    font-size: 30px;
    font-weight: 1000;
    color : rgb(35, 120, 153);
}
.mapdiv{
    text-align: center; 
    width:100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>