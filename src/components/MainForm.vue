<template>
  <section class="section">
    <div class="container">
    <div class="columns">
      <FormulateForm
        v-model="company_details"
        @submit="submitForm"
        class="column is-four-fifths is-offset-2-widescreen is-offset-1-tablet"
      >
        <div class="columns">
          <div class="column is-one-third-desktop is-half-tablet">
            <FormulateInput
              :options="{sarl: $t('sarl'), sa: $t('sa'), snc: $t('snc'), scom: $t('scom'), indiv: $t('indiv')}"
              type="select"
              placeholder="Select an option"
              :label="$t('corp_form')"
              name="corp_form"
              validation="required"
            />
          </div>
          <div class="column is-one-third-desktop is-half-tablet offset_inlinecolumn-column">
            <FormulateInput
              v-model="independent_worker"
              class="offset_inlinecolumn"
              type="checkbox"
              name="independent_worker"
              :label="$t('independent_worker')"
              :disabled="company_details['corp_form'] == 'indiv'"
            />
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-third-desktop is-half-tablet">
            <FormulateInput
              type="text"
              name="zip_code"
              :label="$t('zip_code')"
              placeholder="1008"
              :help="$t('zip_code_help')"
              inputmode="numeric"
              pattern="[0-9]*"
              :validation="['required', ['matches', /^[1-9]{1}[0-9]{3}$/]]"
              class="npafield"
            />
          </div>
          <div class="column is-one-third-desktop is-half-tablet offset_inlinecolumn-column">
            <p class="offset_inlinecolumn largeoffset">{{ computedLocality }}</p>
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-third-desktop is-half-tablet">
            <FormulateInput
              type="text"
              name="avg_rev_monthly"
              :label="$t('avg_rev_monthly')"
              validation="number"
              value="0"
              min="0"
              error-behavior="live"
            />
            <FormulateInput
              type="text"
              name="employee_count"
              :label="$t('employee_count')"
              validation="required|number"
              value="0"
              min="0"
              error-behavior="live"
            />
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-third-desktop is-half-tablet">
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
          <div class="column is-one-third-desktop is-half-tablet">
            <FormulateInput
              v-if="independent_worker"
              type="text"
              name="avg_payroll_independent"
              :label="$t('avg_payroll_independent')"
              validation="number"
              value="0"
              min="0"
              error-behavior="live"
            />
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-third-desktop is-half-tablet">
            <FormulateInput
              type="text"
              name="unemployement_rate"
              :label="$t('unemployement_rate_employees')"
              validation="number"
              value="0"
              min="0"
              max="100"
              error-behavior="live"
              :disabled="avgPayrollMonthlyDisabled"
            />
          </div>
          <div class="column is-one-third-desktop is-half-tablet">
            <FormulateInput
              v-if="independent_worker"
              type="text"
              name="unemployement_rate_independent"
              :label="$t('unemployement_rate_independent')"
              validation="number"
              value="0"
              min="0"
              max="100"
              error-behavior="live"
            />
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-third-desktop is-half-tablet">
            <!--future container-->
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-third-desktop is-half-tablet">
            <FormulateInput
              type="submit"
              :label="$t('lookup_aids')"
              class="submitter"
            />
          </div>
          <div class="column is-one-third-desktop is-half-tablet">
            <button v-on:click="magicSubmit">Magic!</button>
          </div>
        </div>
      </FormulateForm>
    </div>
    <div class="columns" v-if="state_aid != undefined">
      <div class="column is-offset-1-tablet is-offset-1-desktop is-offset-one-fifth-widescreen">
        <div class="columns">
          <div class="column">
            <h3 class="title is-3 result-title">{{ $t('total_sum') }}</h3>
          </div>
          <div class="column is-one-third results-heading">
            <h3 class="title is-3 result-value">{{ numberFormatter.format(state_aid.sum) }}</h3>
          </div>
        </div>
        <div 
          class="columns result-columns" 
          v-for="(value, aid) in state_aid.dict"
          :key="aid">
          <div class="column">
            <h3 class="title is-5 result-item-title">{{ $t(aid) }}</h3>
            <button v-on:click="readMore(aid)">{{ $t('read_more') }}</button>
            <p class="result-item-desc" :id="aid + '-desc'">{{ value.desc }}</p>
          </div>
          <div class="column is-one-third result-item-value-column">
            <h3 class="title is-5 result-item-value">{{ numberFormatter.format(value.value) }}</h3>
          </div>
        </div>
        <div class="columns" v-if="state_aid.approxed">
          <div class="column">
          </div>
          <div class="column is-one-third result-item-value-column">
            <h3 class="title is-5 result-item-title approx-warning">{{ $t('approx_warning') }}</h3>
          </div>
        </div>
      </div>
      <div class="column is-2-desktop is-0">
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
    return { company_details: {'avg_payroll': 0}, state_aid: undefined, visibility: {} };
  },
  computed: {
    numberFormatter() {
      return new Intl.NumberFormat(this.$i18n.locale + '-CH', { style: 'currency', currency: 'CHF', notation: "compact", compactDisplay: "short", useGrouping: true, precision: "largeNumber", minimumSignificantDigits: 3, minimumFractionDigits: 0, maximumFractionDigits: 0 });
    },
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
    computedLocality() {
      var zipCode = this.company_details['zip_code'];
      var locality = this.$props.algo.location(zipCode, this.$i18n.locale);

      if (locality) {
        return locality.city_name + ", " + locality.canton_abbrev;
      }
      return this.$t('zip_code_unknown');
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
    magicSubmit() {
      var input = {};
      input['corp_form'] = "sa";
      input['independent_worker'] = false;
      input['zip_code'] = "1010";
      input['employee_count'] = "10";
      input['avg_payroll'] = "100";
      input['avg_payroll_independent'] = 0;
      input['avg_revenue'] = "180";
      input['unemployement_rate'] = "60";
      input['unemployement_rate_independent'] = 0;
      this.compute_aids(input);
    },
    submitForm (data) {
      this.submittedValues = data;
      
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
      
      this.compute_aids(input);
    },
    compute_aids(input) {
      var state_aid = this.$props.algo.covidaid(input);
      
      const approxed = state_aid.rht_approx;
      delete state_aid.rht_approx;
      
      var sum = 0;
      sum += state_aid.rht;
      sum += state_aid.apg;
      sum += state_aid.credit;
      sum *= 1000;
      
      var localityInfo = this.$props.algo.location_infos(input.zip_code, this.$i18n.locale);
            
      var aid_list = {};
      for (var key in state_aid) {
        var value = state_aid[key];
        if (value != 0) {
          aid_list[key] =  { value: value*1000 };
          aid_list[key]['desc'] = localityInfo[key + "_infos"].text;
          console.log(localityInfo[key + "_infos"].text);
          aid_list[key]['form'] = localityInfo[key + "_infos"].form;
          this.visibility[key] = false;
        }
      }
      
      this.state_aid = {
        sum: sum,
        dict: aid_list,
        approxed: approxed
      };
    },
    readMore(id) {
      var x = document.getElementById(id + "-desc");
      this.visibility[id] = !this.visibility[id];
      if (this.visibility[id]) {
        x.style.display = "block";
      } else {
        x.style.display = "none";
      }
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
.section {
  padding-top: 1.5rem;
}
.submitter {
  margin: 0 auto;
}
.approx-warning {
  font-style: italic;
}
</style>
