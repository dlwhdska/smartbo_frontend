<template>
<div>
<div class="managelist">
    <table>
        <thead>
            <tr>
            <th>차대번호</th>
            <th>차량번호</th>
            <th>차종</th>
            <th>비고</th>
            <th></th>
            </tr>
        </thead>
        <tbody>
            <CarManageListItem 
                            :c="c"
                            v-if="newcarlist"
                            v-for="c in newcarlist"
                            :key="c.id"/>
        </tbody>
    </table>
</div>
    <div class="pagegroup">
        <PageGroup
                v-if="carlist" 
                :path="'/carrent/manage/'"
                :currentPage="$route.params.currentPage ? $route.params.currentPage : 1"
                :totalPage="carlist.totalPages"
                :startPage="startPage"
                :endPage="endPage"

        />
    </div>
</div>
</template>
<script>
import CarManageListItem from '@/pages/car/CarManageListItem.vue'
import PageGroup from '@/components/PageGroup.vue'
import axios from 'axios'
export default {
    name: 'CarManageList',
    components: { CarManageListItem, PageGroup},
    props:["rentlist", "noreturnlist", "menu"],
    data() {
        return {
            currentPage : 1,
            carlist: null,
            newcarlist : [],
            startPage: 1,
            endPage : 1
        }
    },
    methods: {
        carListHandler(){
            console.log("rentlist: ",this.rentlist)
            console.log("noreturnlist: ",this.noreturnlist)
            while(this.newcarlist.length > 0){
                this.newcarlist.pop()
            }
        
            console.log('newcarlist: ',this.newcarlist)
            const url = `${this.backURL}/carrent/managelist/${this.currentPage}`
            axios.get(url)
            .then(response=>{
                console.log(response.data)
                this.carlist = response.data
                for(var value of response.data.content){
                    var car= {
                        id:'',
                        carType:'',
                        maxNum:'',
                        carNo:'',
                        status:0
                    }
                    car.id = value.id
                    console.log('*************',car.id)
                    car.carType = value.carType
                    car.maxNum=value.maxNum
                    car.carNo=value.carNo

                    if(this.rentlist!=null){
                        for(var rent of this.rentlist){
                            if(rent.car.id === car.id){
                                car.status = 1
                            }
                        }
                    }

                    if(this.noreturnlist!=null){
                        for(var noreturn of this.noreturnlist){
                            console.log('noreturn: ',noreturn)
                            if(noreturn.car.id === car.id){
                                console.log("찾았따!")
                                car.status = 2
                            }
                        }
                    }
                    console.log( "status" ,car.status)
                    console.log("car", car)
                    this.newcarlist.push(car)
                    console.log('마지막 newcarlist',this.newcarlist)
                }
                
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
            this.carListHandler()
        },
        //----라우터값이 변경되었을 때 할 일 END----  
        menu() {
            console.log('menu감시')
            this.currentPage = 1
            this.carListHandler()
        }
    },   
    created() {
        console.log('created carmanagelist')
        this.carListHandler()
    }
}
</script>
<style scoped>
table{
    width: 100%;
    border-collapse: collapse;
}

thead {
    background-color: #f5f5f5;
}

th{
    text-align: center;
}

.managelist{
    /* font-family: "Arial", sans-serif; */
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 20px;
    margin: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-left: 6%;
    width: 90%;
}
</style>