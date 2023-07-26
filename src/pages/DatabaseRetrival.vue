<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const goTo = (route) => {
  router.push({ name: route });
};
</script>
<template>
  <div>
    <q-toolbar>
      <q-toolbar-title class="text-primary">Retrive Database</q-toolbar-title>
      <q-space />
      <q-btn flat @click="goTo('chatbox')">Widget-Pinecone</q-btn>
      <q-btn flat @click="goTo('chatboxWindow')">Window-Chroma</q-btn>
    </q-toolbar>
    <router-view />
  </div>
</template>
<style></style>
