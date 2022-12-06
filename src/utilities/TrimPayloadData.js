import { trim } from "lodash";

function trimData(data) {
    //Checks if data is object or array
    //If data is array then parse as it is
    if (!Array?.isArray(data)) {
        Object.keys(data).forEach((item) => {
            if (!Array.isArray(data[item])) {
                if (typeof data[item] === "number" && data[item] !== null && data[item] !== "") {
                    data[item] = parseInt(trim(data[item]));
                } else data[item] = trim(data[item]);
            }
        });
        return data;
    } else {
        return data;
    }
}

export { trimData };
