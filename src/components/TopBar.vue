<template>
  <nav>
    <ul>
      <li v-for="code in languages" :key="code" v-bind:class="[unavailables.includes(code) ? 'unavailable' : '', $i18n.locale == code ? 'active' : '']">
        <a :lang="code" :title="$t('selected', code)" :aria-label="$t('selected', code)" @click="showMore(code)">{{ code.toUpperCase() }}</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'TopBar',
  data () {
    this.$i18n.locale = 'fr';
    return { 
      locale: 'fr',
      languages: ['fr', 'de', 'en', 'it'],
      unavailables: ['de', 'it']
    }
  },
  watch: {
    locale (val) {
      this.$i18n.locale = val
    }
  },
  methods: {
    showMore: function(code) {
      this.locale = code
    }
  }
}
</script>

<style scoped>
nav {
  width: 100%;
  position: absolute;
}
ul {
  padding-top: 8px;
  padding-right: 10px;
  float: right;
}
li {
  padding: 5px 6px;
  display: inline;
  margin-left: 5px;
}
.active {
  background-color: #ccc;
}
.unavailable {
  text-decoration: line-through;
}
</style>