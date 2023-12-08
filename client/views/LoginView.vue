<script setup lang="ts">
import LoginForm from "@/components/Login/LoginForm.vue";
import RegisterForm from "@/components/Login/RegisterForm.vue";
</script>

<template>
  <main>
    <div class="circle green">
      <LoginForm class="center"/>
    </div>
    <div class="circle blue">
      <RegisterForm class="center"/>
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding-top: 5%;
}

.circle {
  height: 400px;
  width: 400px;
  border-radius: 500px;
  background-color: var(--base-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.green {
  background-color: var(--green-light);
}

.blue {
  background-color: var(--blue-light);
}
</style>