import { frontErrorObj } from "./response.util.js"

// ================== queryReqFields =======================
// This function checks if the required fields are present in the query string.
const queryReqFields = (req, res, field_list) => {
    let resObj = {};
    for (const field of field_list) {
        if (req.query[field] === undefined || (typeof (req.query[field]) == 'string' && req.query[field].trim() == '') || req.query[field] == 'null') {
            resObj[[field]] = "This field is required in query params.";
        }
    }
    if (Object.keys(resObj).length !== 0)
        return { error: true, response: frontErrorObj(res, resObj) };
    else return { error: false, response: {} };
};

// ================== bodyReqFields =======================
// This function checks if the required fields are present in the request body.
const bodyReqFields = (req, res, field_list) => {
    let resObj = {};
    for (const field of field_list) {
        if (req.body[field] === undefined ||
            req.body[field] == 'null' ||
            (typeof (req.body[field]) == 'string' && req.body[field].trim() == '') ||
            (Array.isArray(req.body[field]) && req.body[field].length === 0)
        ) {
            resObj[[field]] = "This field is required.";

        }
    }
    if (Object.keys(resObj).length !== 0)
        return { error: true, response: frontErrorObj(res, resObj) };
    else return { error: false, response: {} };
};

export {
    queryReqFields,
    bodyReqFields
};

