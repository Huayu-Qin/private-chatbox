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
      <q-toolbar-title class="text-primary">Source</q-toolbar-title>
      <q-space />
      <q-btn flat @click="goTo('pdfUpload')">PDF</q-btn>
      <q-btn flat @click="goTo('urlUpload')">URL</q-btn>
      <q-btn flat @click="goTo('urlUploadWindow')">URL4Win</q-btn>
    </q-toolbar>
    <router-view />
  </div>
</template>
<style></style>
