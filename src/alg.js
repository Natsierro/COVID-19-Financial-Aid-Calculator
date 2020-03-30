//Covid 19 - Financial Aid Calculator algorithm
import ZipcodeSearch from '@stefanzweifel/js-swiss-cantons/src/ZipcodeSearch';
import CantonManager from '@stefanzweifel/js-swiss-cantons';


var canton_ressources = require('../data/covid19_canton_infos.json');
var city_ressources = require('../data/covid19_city_infos.json');
var more_ressources = require('../data/more_infos.json');

function RHT(m, t){
    /*
        will calculate the Réducation Horaire Travail which means the partial unemployment in CHF given to the firm
        m is the monthly salarial mass of the firm and t is the pourcentage of missing hours
    */
    if(t>=0.1){
        return m*t*0.8;
    }
    else{return 0;}
    
}

function APG(m, t){
    /*
        will calculate the unemployement insurance for independants
        m is the monthly revenue of the independant and t is the pourcentage of missing hours
    */

    if(m>7.35){
        m = 7.35;
    }

    return m*t*0.8;

}

function Credits(CA){
    /*
        will calculate the possible credit the firm can get from the bank due to the measurs of the COVID 19
        CA is the monthly revenue
    */
    if(0.1*12*CA > 20000){
        return 20000;
    }
    else{
        return 0.1*CA*12;
    }
}

function location(zipcode, language) {
    var city_name = "";
    var canton_name = "";
    var canton_abbrev = "";
    
    var search = new ZipcodeSearch();
    var location = search.findbyZipcode(zipcode);
    
    if(location){
        var manager = new CantonManager();
        var canton = manager.getByAbbreviation(location.canton);

        city_name = location.community_name;
        canton_name = canton.setLanguage(language).getName();
        canton_abbrev = location.canton;
        
        return {city_name: city_name, canton_abbrev: canton_abbrev, canton_name: canton_name};
    }

    return false;
}

function location_infos(zipcode, language){
    var city_name = "";
    var canton_name = "";
    var canton_abbrev = "";
    var canton_info = {};
    var canton_links = {};
    var city_info = {};
    var city_links = {};
    var rht_infos = {text: "", form: ""};
    var apg_infos = {text: "", form: ""};
    var credit_infos = {text: "", form: ""};
    var all_infos = {text: ""};

    var rht_info = {};
    var apg_info = {};
    var credit_info = {};
    var all_info = {};
    
    var search = new ZipcodeSearch();
    var location = search.findbyZipcode(zipcode);

    rht_info = more_ressources.find(more_ressources => {
        return more_ressources.type === 'RHT'
    })

    rht_infos.text = rht_info.text[language] !== undefined ? rht_info.text[language] : false

    apg_info = more_ressources.find(more_ressources => {
        return more_ressources.type === 'APG'
    })
    apg_infos.form = apg_info.form[language] !== undefined ? apg_info.form[language] : false
    apg_infos.text = apg_info.text[language] !== undefined ? apg_info.text[language] : false

    credit_info = more_ressources.find(more_ressources => {
        return more_ressources.type === 'Credit'
    })
    credit_infos.form = credit_info.form[language] !== undefined ? credit_info.form[language] : false
    credit_infos.text = credit_info.text[language] !== undefined ? credit_info.text[language] : false

    all_info = more_ressources.find(more_ressources => {
        return more_ressources.type === 'all'
    })
    all_infos.text = all_info.text[language] !== undefined ? all_info.text[language] : false
    
    if(location){
        var manager = new CantonManager();
        var canton = manager.getByAbbreviation(location.canton);

        city_name = location.community_name;
        canton_name = canton.setLanguage(language).getName();
        canton_abbrev = location.canton;
        
        canton_info = canton_ressources.find(canton_ressources => {
            return canton_ressources.canton === canton_abbrev
        })
        canton_links = canton_info !== undefined ? canton_info.link_infos : false

        city_info = city_ressources.find(city_ressources => {
            return city_ressources.city === city_name
        })
        city_links = city_info !== undefined ? city_info.link_infos : false
        
        rht_info = more_ressources.find(more_ressources => {
            return more_ressources.type === 'RHT'
        })
        rht_infos.form = rht_info.form[canton_abbrev] !== undefined ? rht_info.form[canton_abbrev] : false
        
        return {city_name: city_name, canton_abbrev: canton_abbrev, canton_name: canton_name, canton_links: canton_links, city_links: city_links, rht_infos: rht_infos, apg_infos: apg_infos, credit_infos: credit_infos, all_infos: all_infos};
    }

    return {rht_infos: rht_infos, apg_infos: apg_infos, credit_infos: credit_infos, all_infos: all_infos};
}


function covidaid(input){
    /*
        will calculate and return all the information needed to the frontend about the possible aid for the employees
    */
    var result = {
            rht: 0,
            credit: 0,
            apg: 0,
            rht_approx: true
    };

    /*
        Comment:    The partner of the chief can have a maximum of 3320 CHF for a 100% as RHT
                    The temporar workers & apprentices can also have the classic RHT 
    */

   result['credit'] = Credits(input['avg_revenue']);

    if(input['employee_count']==0){
        result['rht'] = Math.min(input['unemployement_rate']*3.32,RHT(input['avg_payroll'],input['unemployement_rate']));
        result['rht_approx'] = false;
    }
    else{
        result['rht'] = RHT(input['avg_payroll'],input['unemployement_rate']);
    }
    if(input['independent_worker']){    
        result['apg'] = APG(input['avg_payroll_independent'],input['unemployement_rate_independent']);
    }

    
    return result;
}

export { covidaid, location, location_infos };