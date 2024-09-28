import { frontError } from "./responses.js"

// ================== queryReqFields =======================
// This function checks if the required fields are present in the query string.
const queryReqFields = (req, res, field_list) => {
    let resObj = {};
    for (const field of field_list) {
        if (!req.query[field] || req.query[field].trim() == '' || req.query[field] == 'null') {
            resObj[[field]] = "This field is required.";
        }
    }
    if (Object.keys(resObj).length !== 0)
        return { error: true, response: frontError(res, resObj) };
    else return { error: false, response: {} };
};

// ================== bodyReqFields =======================
// This function checks if the required fields are present in the request body.
const bodyReqFields = (req, res, field_list) => {
    let resObj = {};
    for (const field of field_list) {
        if (!req.body[field] || req.body[field].trim() == '' || req.body[field] == 'null') {
            resObj[[field]] = "This field is required.";
        }
    }
    if (Object.keys(resObj).length !== 0)
        return { error: true, response: frontError(res, resObj) };
    else return { error: false, response: {} };
};

export {
    queryReqFields,
    bodyReqFields
};
