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
      <q-toolbar-title class="text-primary">Upload Data</q-toolbar-title>
      <q-space />
      <q-btn flat @click="goTo('pdfUpload')">Widget-DOC</q-btn>
      <q-btn flat @click="goTo('urlUpload')">Widget-URL</q-btn>
      <q-btn flat @click="goTo('pdfUploadWindow')">Window-DOC</q-btn>
      <q-btn flat @click="goTo('urlUploadWindow')">Window-URL</q-btn>
    </q-toolbar>
    <router-view />
  </div>
</template>
<style></style>
