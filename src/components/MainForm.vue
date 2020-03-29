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
              validation="number"
              value="0"
              min="0"
              error-behavior="live"
            />
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
              type="text"
              name="avg_payroll"
              :label="$t('avg_payroll_employees')"
              validation="number"
              value="0"
              min="0"
              error-behavior="live"
              :disabled="avgPayrollMonthlyDisabled"
            />
          </div>
          <div class="column is-one-third">
            <FormulateInput
              v-if="independent_worker"
              type="text"
              name="avg_payroll_independent"
              label="Salaire mensuel moyen de l'indépendant (milliers de francs)"
              validation="number"
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
              validation="number"
              value="0"
              min="0"
              max="100"
              error-behavior="live"
              :disabled="avgPayrollMonthlyDisabled"
            />
          </div>
          <div class="column is-one-third">
            <FormulateInput
              v-if="independent_worker"
              type="text"
              name="unemployement_rate_independent"
              label="Taux de chômage partiel de l'indépendant"
              validation="number"
              value="0"
              min="0"
              max="100"
              error-behavior="live"
            />
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-third">
            <!--future container-->
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
    <div class="columns" v-if="state_aid != undefined">
      <div class="column is-offset-one-fifth">
        <div class="columns">
          <div class="column">
            <h3 class="title is-3 result-title is-pulled-right">TOTAL :</h3>
          </div>
          <div class="column is-one-third results-heading">
            <h3 class="title is-3 result-value is-pulled-right">{{ state_aid.sum }} kCHF</h3>
          </div>
        </div>
        <div 
          class="columns" 
          v-for="(value, aid) in state_aid.dict"
          :key="aid">
          <div class="column">
            <h3 class="title is-5 result-item-title is-pulled-right">{{ aid }}</h3>
          </div>
          <div class="column is-one-third result-item-value">
            <h3 class="title is-5 is-pulled-right">{{ value }} kCHF</h3>
          </div>
        </div>
        <div class="columns" v-if="state_aid.approxed">
          <div class="column">
            <h3 class="title is-5 result-item-title is-pulled-right">Warning approximation</h3>
          </div>
          <div class="column is-one-third result-item-value">
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
    return { company_details: {'avg_payroll': 0}, state_aid: undefined };
  },
  computed: {
    avgPayrollMonthlyDisabled() {
      return this.company_details['employee_count'] == 0 && this.independent_worker;
    },
    avgPayrollMonthly() {
      this.company_details;
      return this.avgPayrollMonthlyDisabled ? 0 : this.company_details['avg_payroll'];
    },
    avgPayrollMonthlyIndependent() {
      this.company_details;
      return !this.independent_worker ? 0 : this.company_details['avg_payroll_independent'];
    },
    unemployementRate() {
      this.company_details;
      return this.avgPayrollMonthlyDisabled ? 0 : this.company_details['unemployement_rate'];
    },
    unemployementRateIndependent() {
      this.company_details;
      return !this.independent_worker ? 0 : this.company_details['unemployement_rate_independent'];
    },
    independent_worker: {
      // getter
      get: function () {
        return this.company_details['independent_worker'] || this.company_details['corp_form'] == "indiv";
      },
      // setter
      set: function (newValue) {
        window.independent_worker = newValue;
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
      const payroll = data.avg_payroll;
      const employees = data.employee_count;
      console.log("OK " + revenue + ", " + isIndependent + ", " + unemployement_rate + ", " + payroll + ", " + employees);
      
      var input = {};
      input['corp_form'] = data['corp_form'];
      input['independent_worker'] = this.independent_worker;
      input['zip_code'] = data['zip_code'];
      input['employee_count'] = data['employee_count'];
      input['avg_payroll'] = this.avgPayrollMonthly;
      input['avg_payroll_independent'] = this.avgPayrollMonthlyIndependent;
      input['avg_revenue'] = data['avg_rev_monthly'];
      input['unemployement_rate'] = this.unemployementRate / 100;
      input['unemployement_rate_independent'] = this.unemployementRateIndependent / 100;
      var state_aid = this.$props.algo.covidaid(input);
      console.log(state_aid);
      
      const approxed = state_aid.rht_approx;
      delete state_aid.rht_approx;
      
      var sum = 0;
      sum += state_aid.rht;
      sum += state_aid.apg;
      sum += state_aid.credit;
      
      var aid_list = {};
      for (var key in state_aid) {
        var value = state_aid[key];
        if (value != 0) {
          aid_list[key] = value;
        }
      }
      
      this.state_aid = {
        sum: sum,
        dict: aid_list,
        approxed: approxed
      };
      
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
