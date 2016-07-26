import React from 'react';
import decorate from './decorate';
import {locationShape, routerShape} from 'react-router/es6/PropTypes';

export default function(component) {
    return class extends decorate(component) {
        static propTypes = {
            location: locationShape
        };

        static contextTypes = {
            router: routerShape
        };

        setQState(newState, callback) {
            const qstate = this._extractQState(newState);

            this.pushQuery(this._cleanupQueryString(qstate));

            if(typeof callback === 'function') {
                callback.call(this);
            }
        }

        componentWillReceiveProps(props) {
            this.setState({qstate: props.location.query || {}});
        }

        getQuery() {
            return typeof this.props.location.query ? this.props.location.query : {};
        }

        replaceQuery(query) {
            this.context.router.replace({
                ...this.props.location,
                query
            });
        }

        pushQuery(query) {
            this.context.router.push({
                ...this.props.location,
                query
            });
        }
    };
}