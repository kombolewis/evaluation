exports.checkState = (student,unit_code) => {
    if(student.currentUnits) {
        const states =  student.currentUnits.split(';').filter(code => {
            return code == unit_code
        })
        if(states.length > 0){
            return true;
        }
        return false;
    }
    
} 