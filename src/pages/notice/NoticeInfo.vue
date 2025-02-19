<template >
    <main>
    <div class="noticeinfo">
        <h2>공지사항</h2>
        <div class="title">
            <b>{{n.title}}</b>
            <div class="regdate">{{n.regdate}}</div>
        </div>
        <div class="body">
            <div class="content">{{n.content}}</div><br><br><br><br>
            <div class="writer">{{n.member.name}}</div>
        </div>
    </div>
    </main>
</template>
<script>
import axios from 'axios'

export default {
    name: 'NoticeInfo',
    props:["n"],
    data(){
        return {
            n: {
                title: '',
                content: '',
                regdate: '',
                member: {
                    name: '',
                },
            }
        }
    }, 
    created() {
        //라우터에서 전달된 id파라미터
        const id = this.$route.params.id;
        console.log(id)

        const url = `${this.backURL}/notice/${id}`
        axios.get(url)
        .then(response=>{
            this.n = response.data})
        .catch((error) =>{
            console.log(error)
        })
    },
}
</script>
<style scoped>
.noticeinfo {
    width: 90%;
    font-family: "Arial", sans-serif;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: rgb(236, 243, 253);

    padding: 20px;
    margin: 20px;
    margin-top: 50px;
    
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-left: 6%;
}

h2 {
    text-align: center;
    font-size: 28px;
    color: #2c3e50;
    text-transform: uppercase;
    margin-top: 40px;
    margin-bottom: 70px;
    font-weight: bold;
    text-shadow: 1px 1px 1px #ccc;
}

.title {
    margin: 50px;
    font-size: 22px;

    color: #2c3e50;
    text-transform: uppercase;
}

.regdate {
    float: right;
}

div.body {
    height: 500px;
    margin: 50px;
    padding: 80px;

    border: 1px solid #ddd;
    border-radius: 1rem;
    background-color: #f7f7f7;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.content {
    height: 70%;
}

.writer {
    float: right;
}
</style>