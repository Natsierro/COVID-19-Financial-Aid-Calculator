//Covid 19 - Financial Aid Calculator algorithm

function RHT(m, t){
    //m is the monthly salarial mass of the firm and t is the pourcentage of missing hours
    
    return m*t*0.8
}

function APG(m, t){
    //m is the monthly revenue of the independant and t is the pourcentage of missing hours
    if(t*m>7350){
        return 7350*0.8
    }
    else{
        return m*t*0.8
    }
}

function Credits(CA){
    //CA is the yearly revenue
    if(0.1*CA > 20000000){
        return 20000000
    }
    else{
        return 0.1*CA
    }
}