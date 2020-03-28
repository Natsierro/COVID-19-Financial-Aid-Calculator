<template>
  <section class="section">
  <div class="container">
    <h4 class="title is-4">[FORMULAIRE] {{ $i18n.locale }}</h4>
    <FormulateInput
      v-model="corp_form"
      :options="{sarl: 'SàRL', sa: 'SA', snc: 'Société en nom collectif', scom: 'Société par commandite', indiv: 'Fourth'}"
      type="select"
      placeholder="Select an option"
      :label="$t('corp_form')"
    />
  </div>
  </section>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data () {
    return { corp_form: '' }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
