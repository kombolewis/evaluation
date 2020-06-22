exports.checkState = (staff,unit_code) => {
   
    if(staff.assignedUnits){    
        const states =  staff.assignedUnits.split(';').filter(code => {
            return code == unit_code;
        });
    
        if(states.length > 0){
            return true;
        }
        return false;
    }
    
} 