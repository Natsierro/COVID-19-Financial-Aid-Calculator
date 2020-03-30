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
              :options="{sarl: 'SàRL', sa: 'SA', snc: 'Société en nom collectif', scom: 'Société par commandite', indiv: 'Entreprise individuelle'}"
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
              label="Indépendant"
              :disabled="company_details['corp_form'] == 'indiv'"
            />
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-third-desktop is-half-tablet">
            <FormulateInput
              type="text"
              name="zip_code"
              label="NPA (code postal)"
              placeholder="1008"
              help="Entrez votre code postal. Nous calculerons automatiquement canton et ville."
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
              label="Salaire mensuel moyen de l'indépendant (milliers de francs)"
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
              label="Taux de chômage partiel"
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
          <div class="column is-one-third-desktop is-half-tablet">
            <!--future container-->
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-third-desktop is-half-tablet">
            <FormulateInput
              type="submit"
              label="Rechercher mes aides"
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
            <h3 class="title is-3 result-title">TOTAL :</h3>
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
      return "Ce NPA est introuvable.";
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
      console.log(localityInfo);
      localityInfo = {
        all_infos: {
          text: "Les entreprises frappées par la crise auront la possibilité de différer provisoirement et sans intérêt le versement des contributions aux assurances sociales (AVS, AI, APG, AC). les entreprises pourront repousser sans intérêt moratoire les délais de versement  pour les fournisseurs de la Confédération. Du 19 mars au 4 avril 2020 inclus, les débiteurs ne pourront pas être poursuivis, et ce sur tout le territoire suisse.",
          type: "all"
        },
        apg_infos: {
          type: "APG", 
          text: "Les personnes exerçant une activité indépendante qui subissent une perte de gain due aux mesures prises par le gouvernement en vue de lutter contre le coronavirus seront indemnisées si elles ne bénéficient pas déjà d’une indemnité ou de prestations d’assurance. Une indemnisation est prévue dans les cas suivants :\n\n- fermeture des écoles ;\n- quarantaine ordonnée par un médecin ;\n\n- fermeture d’un établissement géré de manière indépendante et ouvert au public.\nLa réglementation s’applique également aux artistes indépendants qui ont subi une perte de gain parce que leur engagement a été annulé en raison des mesures de lutte contre le coro-navirus ou qu’ils ont dû annuler un événement organisé en propre.", 
          form: "https://www.ahv-iv.ch/fr/Nouvelles-Infos/post/corona-erwerbsersatzentschaedigung-formular-merkblaetter-etc-sind-bereit"
        },
        canton_abbrev: "VD",
        canton_links: "https://www.vd.ch/toutes-les-autorites/departements/departement-de-leconomie-de-linnovation-et-du-sport-deis/service-de-lemploi-sde/",
        canton_name: "Vaud",
        city_links: "https://www.lausanne.ch/en/vie-pratique/economie-et-commerces/COVID-19.html",
        city_name: "Lausanne",
        credit_infos: {
          type: "Credit", 
          text: "Aide immédiate sous la forme de crédits transitoires spécifique\nLes montants jusqu’à 0,5 million de francs seront versés immédiatement par les banques et seront couverts en totalité par la garantie de la Confédération. Cette garantie sera ramenée à 85 % pour les montants dépassant ce plafond, qui devront alors faire l’objet d’un bref examen par les banques. Les montants jusqu’à 0,5 million devraient couvrir les besoins de plus de 90 % des entreprises touchées par les conséquences de l’épidémie de coronavirus.", 
          form: "https://www.easygov.swiss/easygov/#/fr/landing/covid"
        },
        rht_infos: {
          type: "RHT", 
          text: "Extension du chômage partiel et simplification des démarches\nLe chômage partiel pourra désormais également être octroyé aux salariés dont la durée d’engagement est limitée et aux personnes au service d’une organisation de travail temporaire. La perte de travail sera également comptabilisée pour les personnes qui sont en apprentissage. Le chômage partiel pourra être accordé aux personnes qui occupent une position assimilable à celle d’un employeur.  Les personnes qui travaillent dans l’entreprise de leur conjoint ou partenaire enregistré pourront également profiter du chômage partiel et faire valoir une indemnisation forfaitaire de 3320 francs pour un poste à plein temps.", 
          form: "https://www.vd.ch/themes/economie/employeurs/indemnite-pour-reduction-de-lhoraire-de-travail-dans-le-cadre-de-lepidemie-de-coronavirus-2019-ncov/"
        }
      }
      
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
