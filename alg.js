//Covid 19 - Financial Aid Calculator algorithm
import ZipcodeSearch from 'js-swiss-cantons/src';
import CantonManager from 'js-swiss-cantons/src';

var language = 'fr';

function RHT(m, t){
    /*
        will calculate the Réducation Horaire Travail which means the partial unemployment in CHF given to the firm
        m is the monthly salarial mass of the firm and t is the pourcentage of missing hours
    */
    if(t=>0.1){
        return m*t*0.8
    }
    else{return 0}
    
}

function APG(m, t){
    /*
        will calculate the unemployement insurance for independants
        m is the monthly revenue of the independant and t is the pourcentage of missing hours
    */

    if(m>7350){
        m = 7350;
    }

    return m*t*0.8

}

function Credits(CA){
    /*
        will calculate the possible credit the firm can get from the bank due to the measurs of the COVID 19
        CA is the monthly revenue
    */
    if(0.1*12*CA > 20000000){
        return 20000000
    }
    else{
        return 0.1*CA*12
    }
}

function covidaid(firm, CA, independant, zipcode, t, m, employees){
    /*
        will calculate and return all the information needed to the frontend about the possible aid for the employees
        VARIABLES:
            firm: "Entreprise individuelle", "Société en nom collectif", "SARL", "SA", "Société en commandite"
            CA: Average monthly revenue (INT in CHF)
            indepandant: Boolean telling if the applicant has the independant status or not
            zipcode: Zipcode of the city where the firm is
            t: The percentage of the economic activity being stopped because of the COVID 19
            m: mass of all salaries (monthly)
            employees: number of employees
    */
    var rht = 0;
    var apg = 0;
    var credit = 0;
    var city_name = "";
    var canton_name = "";
   
    var search = new ZipcodeSearch();
    var location = search.findbyZipcode(zipcode);
    if(location){
        var manager = new CantonManager();
        var canton = manager.getByAbbreviation(location.canton);

        city_name = location.city_name;
        canton_name = canton.setLanguage(language).getName();
    }
    
    /*
        Comment:    The partner of the chief can have a maximum of 3320 CHF for a 100% as RHT
                    The temporar workers & apprentices can also have the classic RHT 
    */
    if(firm=="Entreprise individuelle"){
        /*
            Comment:    The number of subsidies is limited to 10 per month for the people in quarantine
                        If take on managerial tasks the number of subsidies is limited to 30
        */
        if(employees==0){
            credit = Credits(CA);
        }
        else{
            rht = RHT(m,t); //for the employees
            apg = APG(CA,t);
            credit = Credits(CA);
        } 
    }

    else{
        if(employees==0){
            credit = Credits(CA);
        }
        else{
            rht = RHT(m,t);
            credit = Credits(CA);
        }
        
    }
}

function covidaid_self(firm, CA, independant, zipcode, t, m){
    /*
        will calculate and return all the information needed to the frontend about the possible aid to the employer
        VARIABLES:
            firm: "Entreprise individuelle", "Société en nom collectif", "SARL", "SA", "Société en commandite"
            CA: Average monthly revenue (INT in CHF)
            indepandant: Boolean telling if the applicant has the independant status or not
            zipcode: Zipcode of the city where the firm is
            t: The percentage of the economic activity being stopped because of the COVID 19
            m: mass of all salaries (monthly)
            employees: number of employees
    */
    var rht = 0;
    var apg = 0;
    
    /*
        Comment:    The partner of the chief can have a maximum of 3320 CHF for a 100% as RHT
                    The temporar workers & apprentices can also have the classic RHT 
    */
    if(firm=="Entreprise individuelle"){
        /*
            Comment:    The number of subsidies is limited to 10 per month for the people in quarantine
                        If take on managerial tasks the number of subsidies is limited to 30
        */

        apg = APG(CA,t); //Warning, not applicable for every sector
    }

    else{
        if(independant){
            rht = min(3320,RHT(m,t));
        }
        else{
            rht = RHT(m,t);
        }
        
    }

}

var canton_ressources = [
    {
        "canton": "AG",
        "link": "https://www.ag.ch/de/dvi/wirtschaft_arbeit/departement_teaser_6.jsp"
    },
    {
        "canton": "AI",
        "link": "https://www.ai.ch/themen/wirtschaft-und-arbeit/arbeit"
    },
    {
        "canton": "AR",
        "link": "https://www.ar.ch/verwaltung/departement-bau-und-volkswirtschaft/arbeitslosenversicherung-ar/"
    },
    {
        "canton": "BE",
        "link": "https://www.vol.be.ch/vol/fr/index/arbeit.html"
    },
    {
        "canton": "BL",
        "link": "https://www.baselland.ch/politik-und-behorden/direktionen/volkswirtschafts-und-gesundheitsdirektion/kiga"
    },
    {
        "canton": "BS",
        "link": "https://www.awa.bs.ch/"
    },
    {
        "canton": "FR",
        "link": "https://www.fr.ch/spe"
    },
    {
        "canton": "GE",
        "link": "https://www.ge.ch/organisation/office-cantonal-emploi-oce"
    },
    {
        "canton": "GL",
        "link": "https://www.gl.ch/verwaltung/volkswirtschaft-und-inneres/wirtschaft-und-arbeit.html/1039"
    },
    {
        "canton": "GR",
        "link": "https://www.gr.ch/DE/institutionen/verwaltung/dvs/kiga/Seiten/home.aspx"
    },
    {
        "canton": "JU",
        "link": "https://www.jura.ch/fr/Autorites/Administration/DES/SEE.html"
    },
    {
        "canton": "LU",
        "link": "https://wira.was-luzern.ch/"
    },
    {
        "canton": "NE",
        "link": "https://www.ne.ch/autorites/DEAS/SEMP/Pages/accueil.aspx"
    },
    {
        "canton": "NW",
        "link": "https://www.nw.ch/arbeitsamt/314"
    },
    {
        "canton": "OW",
        "link": "https://www.ow.ch/de/verwaltung/aemter/?amt_id=161"
    },
    {
        "canton": "SG",
        "link": "https://www.sg.ch/politik-verwaltung/departemente-und-staatskanzlei/volkswirtschaftsdepartement/amt-fuer-wirtschaft-und-arbeit.html"
    },
    {
        "canton": "SH",
        "link": "https://sh.ch/CMS/Webseite/Kanton-Schaffhausen/Beh-rde/Verwaltung/Volkswirtschaftsdepartement/Arbeitsamt-3858-DE.html"
    },
    {
        "canton": "SO",
        "link": "https://so.ch/verwaltung/volkswirtschaftsdepartement/amt-fuer-wirtschaft-und-arbeit/"
    },
    {
        "canton": "SZ",
        "link": "https://www.sz.ch/unternehmen/arbeit-gewerbeaufsicht/arbeit.html/72-443-4443-1877"
    },
    {
        "canton": "TG",
        "link": "https://awa.tg.ch/"
    },
    {
        "canton": "TI",
        "link": "https://www4.ti.ch/dfe/de/mercato-del-lavoro/"
    },
    {
        "canton": "UR",
        "link": "https://www.ur.ch/aemter/853"
    },
    {
        "canton": "VD",
        "link": "https://www.vd.ch/toutes-les-autorites/departements/departement-de-leconomie-de-linnovation-et-du-sport-deis/service-de-lemploi-sde/"
    },
    {
        "canton": "VS",
        "link": "https://www.vs.ch/fr/web/sict"
    },
    {
        "canton": "ZG",
        "link": "https://www.zg.ch/behoerden/volkswirtschaftsdirektion/amt-fur-wirtschaft-und-arbeit"
    },
    {
        "canton": "ZH",
        "link": "https://awa.zh.ch/internet/volkswirtschaftsdirektion/awa/de/home.html"
    }
];

