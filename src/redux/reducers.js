import {
    BEGIN_QUERY, RECEIVE_PAGE, BEGIN_FETCH_NEXT_PAGE,
    BEGIN_FETCH_DETAILS, RECEIVE_DETAILS,
    SUBSCRIBE, UNSUBSCRIBE
} from './actions'
import omit from 'lodash/omit';
import * as Immutable from "immutable";

const initialState = Immutable.fromJS({
    subscriptions: Immutable.Map(),
    subsLastUpdatedBy: null,
    variants: Immutable.List(),
    details: Immutable.OrderedMap(),
    isFetching: false,
    isFetchingDetails: false,
    query: null,
    pageIndex: 0,
    pageSize: 10,
    totalResults: -1
});

function subscriberReducer(state=initialState, action) {
    switch (action.type) {
        case BEGIN_QUERY:
            return state.merge({
                query: action.query,
                pageIndex: 0,
                variants: Immutable.List(),
                totalResults: -1,
                isFetching: true
            });

        case BEGIN_FETCH_NEXT_PAGE:
            return state.merge({
                pageIndex: action.pageIndex,
                isFetching: true
            });

        case RECEIVE_PAGE:
            return state.merge({
                variants: state.get('variants').concat(action.items),
                totalResults: action.totalResults,
                synonyms: action.synonyms,
                isFetching: false
            });

        case BEGIN_FETCH_DETAILS:
            return state.merge({
                isFetchingDetails: true
            });

        case RECEIVE_DETAILS:
            return state.merge({
                details: state.get('details').set(action.variantID, action.item).takeLast(10),
                isFetchingDetails: false
            });

        case SUBSCRIBE:
            return state.merge({
                subscriptions: state.get('subscriptions').set(action.item.id, action.item),
                subsLastUpdatedBy: action.origin
            });

        case UNSUBSCRIBE:
            return state.merge({
                subscriptions: state.get('subscriptions').delete(action.item.id),
                subsLastUpdatedBy: action.origin
            });

        default:
            return state;
    }
}

export default {
    brca: subscriberReducer
};