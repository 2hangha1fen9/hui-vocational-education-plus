<template>
    <div class="main">
        <router-view />
    </div>
    <div id="info">
        Blog：<a href="https://blog.zhfsmy.cloud">SunnyBlog</a> Gitee：<a
            href="https://gitee.com/zhanghaifeng0253">zhanghaifeng0253</a> GitHub：<a
            href="https://github.com/2hangha1fen9">2hangha1fen9</a>
        Powered By .Net 7 On Docker
    </div>
</template>

<script lang="ts" setup>
</script>
<style>
.main {
    width: 820px;
    max-width: 100%;
    margin: 0 auto;
}

#info {
    position: fixed;
    bottom: 0;
    right: 20px;
}</style>
