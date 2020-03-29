//Covid 19 - Financial Aid Calculator algorithm
import ZipcodeSearch from '@stefanzweifel/js-swiss-cantons';
import CantonManager from '@stefanzweifel/js-swiss-cantons';


var canton_ressources = require('../data/covid19_canton_infos.json');
var city_ressources = require('../data/covid19_city_infos.json');

function RHT(m, t){
    /*
        will calculate the Réducation Horaire Travail which means the partial unemployment in CHF given to the firm
        m is the monthly salarial mass of the firm and t is the pourcentage of missing hours
    */
    if(t=>0.1){
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

function location(zipcode, language){
    var city_name = "";
    var canton_name = "";
   
    var search = new ZipcodeSearch();
    var location = search.findbyZipcode(zipcode);
    if(location){
        var manager = new CantonManager();
        var canton = manager.getByAbbreviation(location.canton);

        city_name = location.community_name;
        canton_name = canton.setLanguage(language).getName();
    }

    var canton_info = jsObjects.find(canton_ressources => {
        return canton_ressources.canton === canton_name
      })

    var city_info = jsObjects.find(city_ressources => {
        return city_ressources.city === city_name
        })

    return [city_name, canton_name, canton_info.link_infos, city_info.link_infos];
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

export { covidaid, location };