<template>
  <section class="section">
    <div class="container">
      <h1 class="title site-title">
        <span class="sitename">covidaid.ch</span><span class="site-title-separator">:</span> {{ $t('tagline') }}
      </h1>
      <p class="subtitle site-subtitle">{{ $t('site-description') }}</p>
      <p class="subtitle site-subtitle"><em>{{ $t('site-calltoaction') }}</em></p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeaderView'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.section {
  background-color: rgba(221, 208, 198, 0.5);
  padding-bottom: 1.5rem;
}
</style>
