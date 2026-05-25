<template>
  <v-app>

    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-btn @click="loadRouter()">
        load router
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-footer>

    </v-footer>

  </v-app>
</template>

<script>
export default {
  name: 'App',
  components: {
    // components,
  },

  data() {
    return {
      // data: '',
    }
  },

  computed: {
    // function() {
    //   return ">>This is a computed Data !<<";
    // }
  },

  methods: {
    // function() {
    //   smthing
    // },

    loadRouter() { // permet de modifier l'adresse avec un 'nom' equivalent dans le router.js
      this.$router.push({ name: 'hello' });
    },
  },

  mounted() {
    // smthing
  },

};
</script>

<style>

</style>
