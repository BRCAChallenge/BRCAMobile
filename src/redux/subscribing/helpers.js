import 'whatwg-fetch';
import {checkStatus} from '../../toolbox/misc';

// helper functions

export function encodeParams(params) {
    const esc = encodeURIComponent;
    return Object.keys(params)
        .map(k => esc(k) + '=' + esc(params[k]))
        .join('&');
}

export function queryVariantsForPage(query, page_num, page_size) {
    let args = {
        format: 'json',
        search_term: query,
        page_size: page_size,
        page_num: page_num
    };

    // extra params
    const includes = [
        'Variant_in_ENIGMA',
        'Variant_in_ClinVar',
        'Variant_in_1000_Genomes',
        'Variant_in_ExAC',
        'Variant_in_LOVD',
        'Variant_in_BIC',
        'Variant_in_ESP',
        'Variant_in_exLOVD'
    ];
    const include_params = "&" + includes.map(x => "include=" + x).join("&");

    let queryString = 'http://brcaexchange.org/backend/data/?' + encodeParams(args) + include_params;
    console.log("Query Request: ", queryString);

    return fetch(queryString)
        .then(checkStatus)
        .catch((error) => console.warn("fetch error:", error.message))
        .then(response => response.json());
}

export function fetchDetails(variantID) {
    let args = {
        variant_id: variantID
    };

    let queryString = 'http://brcaexchange.org/backend/data/variant/?' + encodeParams(args);
    // console.log("Details Request: ", queryString);

    return fetch(queryString)
        .then(checkStatus)
        .catch((error) => console.warn("fetch error:", error.message))
        .then(response => response.json());
}