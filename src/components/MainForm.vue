<template>
  <section class="section">
    <div class="container">
    <div class="columns">
      <FormulateForm
        v-model="company_details"
        @submit="compute_aids"
        class="column is-four-fifths is-offset-2"
      >
        <div class="columns">
          <div class="column is-one-third">
            <FormulateInput
              :options="{sarl: 'SàRL', sa: 'SA', snc: 'Société en nom collectif', scom: 'Société par commandite', indiv: 'Entreprise individuelle'}"
              type="select"
              placeholder="Select an option"
              :label="$t('corp_form')"
              name="corp_form"
              validation="required"
            />
          </div>
          <div class="column is-one-third">
            <FormulateInput
              v-model="independent_worker"
              class="independent_worker"
              type="checkbox"
              name="independent_worker"
              label="Indépendant"
              :disabled="company_details['corp_form'] == 'indiv'"
            />
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-third">
            <FormulateInput
              type="text"
              name="zip_code"
              label="NPA (code postal)"
              placeholder="1008"
              help="Entrez votre code postal. Nous calculerons automatiquement canton et ville."
              inputmode="numeric"
              pattern="[0-9]*"
              :validation="['required', ['matches', /^[1-9]{1}[0-9]{3}$/]]"
            />
            <FormulateInput
              type="text"
              name="avg_rev_monthly"
              label="Revenu mensuel moyen de votre entreprise (milliers de francs)"
              validation="required|number"
              value="0"
              min="0"
              error-behavior="live"
            />
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-third">
            <FormulateInput
              type="text"
              name="avg_payroll_monthly"
              :label="(!independent_worker) ? $t('avg_payroll_monthly_employees') : $t('avg_payroll_monthly_independentsemployees')"
              validation="required|number"
              value="0"
              min="0"
              error-behavior="live"
            />
          </div>
          <div class="column is-one-third">
            <FormulateInput
              v-if="independent_worker"
              type="text"
              name="avg_payroll_monthly_independent"
              label="Salaire mensuel moyen de l'indépendant (milliers de francs)"
              validation="required|number"
              value="0"
              min="0"
              error-behavior="live"
            />
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-third">
            <FormulateInput
              type="text"
              name="unemployement_rate"
              label="Taux de chômage partiel"
              validation="required|number"
              value="0"
              min="0"
              max="100"
              error-behavior="live"
            />
          </div>
          <div class="column is-one-third">
            <FormulateInput
              v-if="independent_worker"
              type="text"
              name="unemployement_rate_independent"
              label="Taux de chômage partiel de l'indépendant"
              validation="required|number"
              value="0"
              min="0"
              max="100"
              error-behavior="live"
            />
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-third">
            <FormulateInput
              type="text"
              name="employee_count"
              label="Nombre d'employés"
              validation="required|number"
              value="0"
              min="0"
              error-behavior="live"
            />
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-third">
            <FormulateInput
              type="submit"
              label="Rechercher mes aides"
              class="submitter"
            />
          </div>
        </div>
      </FormulateForm>
    </div>
    <div class="columns">
      <div class="column is-offset-one-fifth">
        <div class="columns">
          <div class="column">
            <h3 class="title is-3 result-title is-pulled-right">TOTAL :</h3>
          </div>
          <div class="column is-one-third results-heading">
            <h3 class="title is-3 result-value is-pulled-right">120 kCHF</h3>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <h3 class="title is-5 result-item-title is-pulled-right">Crédit transitoire max</h3>
          </div>
          <div class="column is-one-third result-item-value">
            <h3 class="title is-5 is-pulled-right">20 kCHF</h3>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <h3 class="title is-5 result-item-title is-pulled-right">APG pour l'employeur</h3>
          </div>
          <div class="column is-one-third result-item-value">
            <h3 class="title is-5 is-pulled-right">20 kCHF</h3>
          </div>
        </div>
      </div>
      <div class="column is-2">
      </div>
    </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    algo: Object()
  },
  data () {
    return { company_details: {} };
  },
  computed: {
    independent_worker: {
      // getter
      get: function () {
        return this.company_details['independent_worker'] || this.company_details['corp_form'] == "indiv";
      },
      // setter
      set: function (newValue) {
        this.company_details['independent_worker'] = newValue;
      }
    },
    values () {
      if (this.submittedValues) {
        return this.submittedValues;
      }
      const values = {};
      for (const key in this.company_details) {
        if (typeof this.company_details[key] === 'object') {
          values[key] = this.company_details[key].toString();
        } else {
          values[key] = this.company_details[key];
        }
      }
      return values;
    }
  },
  watch: {
    values() {
      //this.company_details['independent_worker'] = this.company_details['corp_form'] == "indiv";
    }
  },
  methods: {
    compute_aids (data) {
      this.submittedValues = data;
      const revenue = data.avg_rev_monthly;
      const isIndependent = data.independent_worker;
      const unemployement_rate = data.unemployement_rate;
      const payroll = data.avg_payroll_monthly;
      const employees = data.employee_count;
      console.log("OK " + revenue + ", " + isIndependent + ", " + unemployement_rate + ", " + payroll + ", " + employees);
      var credit, rht = this.$props.algo.covidaid(revenue, isIndependent, unemployement_rate, payroll, employees);
      console.log(credit, rht);
      
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.nextby {
  display: flex;
}
.nextby > div:nth-child(2) { 
  flex: 1;
}
.independent_worker {
  margin-top:23px;
  margin-left:30px;
}
.section {
  padding-top: 1.5rem;
}
.submitter {
  margin: 0 auto;
}
.results-heading {
  background-color: black;
  color: white;
  text-align: right;
}
.result-title {
  font-style: italic;
}
.result-value {
  color: white;
}
.result-item-title, .result-item-desc {
  display: block;
  text-align: right;
}
.result-item-value {
  border-bottom: 1px solid black;
}
</style>
