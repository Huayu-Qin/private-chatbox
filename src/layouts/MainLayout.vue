<script setup>
import { useRouter } from "vue-router";

// build a router
const router = useRouter();
// redirect to the page by the route name
const goTo = (route) => {
  router.push({ name: route });
};
</script>
<template>
  <div id="main-layout">
    <navbar />
    <div>
      <q-toolbar>
        <q-toolbar-title class="text-primary">My Chatbot</q-toolbar-title>
        <q-space />
        <q-btn flat @click="goTo('chatbox')">Chat With Data</q-btn>
        <q-btn flat @click="goTo('chatboxWindowMemory')">ChatBox</q-btn>
        <q-btn flat @click="goTo('modelConfig')">modelConfig</q-btn>
        <q-btn flat @click="goTo('pdfUpload')">Source</q-btn>
      </q-toolbar>
      <router-view class="page-height" />
    </div>
  </div>
</template>
<style scoped>
.page-height {
  height: calc(100vh - 64px);
  overflow-y: auto;
}
</style>

<!-- <template>
  <div id="main-layout">
    <navbar />
    <router-view />
  </div>
</template>

<script>
import Navbar from 'components/AppNavbar.vue'

export default {
  components: {
    Navbar
  }
}
</script>

<style scoped>
</style> -->

<!-- <template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script> -->
