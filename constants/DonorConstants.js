global.SelectedDonor = {};


export function getSelectedDonor() {
    return global.SelectedDonor;
}

export function setSelectedDonor(obj) {
    console.log(obj);
    global.SelectedDonor = obj;
}